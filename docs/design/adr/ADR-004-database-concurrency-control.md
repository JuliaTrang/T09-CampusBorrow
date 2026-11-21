# ADR-004: Concurrency control for approvals, submissions and record edits

- **Status:** Accepted
- **Date:** 2026-11-17
- **Revised:** 2026-11-21 – the locked operations now include pickup change and CO-03, and CO-04 is covered under rooms (PR #59 review, aligned with ADR-005 and DM-01). The decision itself is unchanged.
- **Deciders:** Team T09 (TetraBo)
- **Refines:** the concurrency consequences of ADR-001
- **Drivers:** FR-03-03, FR-03-06, FR-07-03, BR-17, NFR-09
- **Affects:** CMP-03 – CMP-05, SD-02, SD-04, ERD-01

## Context

- Any active RM or Admin may act on any request (BR-01), so concurrent operations on the same item or room are normal.
- NFR-09 requires that, when 20 approval attempts compete, at most one conflicting approval succeeds. For equipment, the winning approval must also reject the other Pending requests atomically (FR-03-06). For rooms, the losers stay Pending (FR-07-03).
- Duplicate active requests (FR-03-03), stale screens (FR-07-04, BR-17, FR-09-11) and concurrent duplicate codes or usernames (FR-02-11, BR-06) must also be rejected without partial changes.
- The API runs on several serverless instances, so locks in application memory do not work.

## Decision

Each operation runs in one Prisma interactive transaction (`READ COMMITTED`) and the database enforces the invariants:

- **Equipment – row lock.** Every operation that changes an item's occupancy (submit, approve, pickup change, cancel, hand over, return, expire, CO-01, CO-02, CO-03) first locks the item's `resources` row (`SELECT … FOR UPDATE`). It then rechecks the current state and writes. CO-03 rechecks occupancy and event order before it changes a handover or return time. Approval sets `APPROVED`, rejects all other `PENDING` requests for the item with the system reason "Equipment has been reserved for another request" (`EQ_REQUEST_AUTO_REJECTED`, actor `SYSTEM`) and appends history, all in the same transaction.
- **Equipment – safety net.** Partial unique indexes on `equipment_requests`: `(resource_id) WHERE status IN (APPROVED, ON_LOAN)`, and `(borrower_id, resource_id) WHERE status IN (PENDING, APPROVED, ON_LOAN)`.
- **Rooms – exclusion constraint.** `EXCLUDE USING gist (resource_id WITH =, tstzrange(start_at, end_at, '[)') WITH &&) WHERE status = APPROVED`, using `btree_gist`. Pending bookings do not block each other. If an approval violates the constraint (SQLSTATE `23P01`), the transaction rolls back, the API returns 409 and the request stays `PENDING`. Releasing an interval (cancellation, CO-04) cannot create an overlap, so it needs no lock: CO-04 is a conditional update `WHERE status = APPROVED AND version = ?` that also requires `now < start_at`, so the interval is released exactly once.
- **Stale edits – optimistic version.** `resources`, `equipment_requests` and `room_bookings` carry an integer `version`. Updates use `WHERE id = ? AND version = ?` and increment it; 0 rows updated returns 409 "record changed – reload".
- **Idempotent transitions.** Each state change is a conditional update on the expected source state, for example `WHERE status = PENDING`. History is appended only when exactly one row changed (FR-07-09, AC-03-14).
- **Uniqueness.** Case-insensitive unique indexes on `lower(resources.code)`, `lower(accounts.username)` and `lower(accounts.email)`.
- **Error mapping.** `HttpExceptionFilter` maps constraint violations and version mismatches to 409, never to 5xx (NFR-06).

## Alternatives considered

- **`SERIALIZABLE` isolation with retries:** simpler to reason about, but under NFR-09 load it causes many serialisation failures and retry loops in short-lived functions.
- **Application-level "check then insert":** leaves a race window, so it fails NFR-09.
- **Shared mutex in Redis:** adds a paid external service for something the database already provides.
- **Optimistic version only:** does not stop two different room requests from producing overlapping approved bookings, so the constraint is still needed.

## Consequences

- **Positive:** the invariants hold even if service code has a bug, and the NFR-09 test (20 parallel requests repeated 10 times) is deterministic.
- **Negative:** the exclusion constraint and the partial indexes need hand-written SQL migrations, and a migration test checks that they exist. A row lock serialises operations only for the same item, and transactions must stay short with no external calls inside.
- **Priorities:** FR-02-14 (stale catalog saves) and the UC-22 corrections (FR-09-09 – FR-09-12) are Should. The `version` column and the CO-01/CO-02 locking are kept in the design; if either feature is deferred, the PA2 §5.1.12 fallback applies (one designated catalog editor; correction mutations disabled). Approval and reservation protection is Must and is never deferred.
- **Follow-up:** clients must send the version they loaded, and screens S05, S09 and S14 show the 409 reload message. ERD-01 must show the constraints.
