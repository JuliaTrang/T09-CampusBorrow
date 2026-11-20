# ADR-005: Time handling and pickup-expiry processing

- **Status:** Proposed (I-04). Waits for confirmation by the owners of I-04 (Minh with Nhat Anh) before the PA3 design freeze; accepting it closes the I-04 subdecisions on the expiry delay target and the scheduling design.
- **Date:** 2026-11-17
- **Deciders:** Team T09 (TetraBo)
- **Drivers:** BR-04, FR-03-13 – FR-03-15, DR-09
- **Affects:** CMP-04, CMP-08, CMP-09, SD-03, SM-01

## Context

- BR-04 defines `expiry_at = min(confirmed_pickup_at + 24 h, return_due_at)`.
- At `now ≥ expiry_at` an approved, uncollected request must be cancelled and its reservation released (FR-03-13). Handover and pickup changes must enforce the cut-off even when background processing is late (FR-03-15), and repeated evaluations must have no extra effect (AC-03-14).
- Business time is UTC+7, evaluated on the server (DR-09).
- The kickoff agreed that `expiry_at` and overdue are computed, not stored.
- Vercel Functions have no long-running process, so an in-process cron would never fire, and Vercel Cron on the Hobby plan runs at most once a day.

## Decision

- **Time.** Store `timestamptz` (UTC). The API exchanges ISO 8601 with an offset, and intervals are half-open `[start, end)`. Every time-based decision uses the injectable `Clock` (CMP-09); client time is never trusted. Periods come from the fixed `periods` table (BR-03).
- **Computed expiry.** `expiry_at` is never stored. `EquipmentRequestService` computes it, and SQL uses `LEAST(confirmed_pickup_at + interval '24 hours', return_due_at)`. The "Collect before" time shown on screens is this value, and read views show an `APPROVED` request with `now ≥ expiry_at` as Expired immediately.
- **Enforcement on access (primary).** Inside the ADR-004 locked transaction, submission, approval, pickup change, cancellation, handover and correction CO-01 for an item first call `expireIfDue(resourceId)`, so an immediate expiry becomes part of the same consistent outcome (BR-20). Handover then requires `confirmed_pickup_at ≤ now < expiry_at`, and a pickup change requires `now < expiry_at`.
- **Background sweep (secondary).** Supabase `pg_cron` runs every minute and calls `POST /api/internal/jobs/expire` through `pg_net` with a secret header. `ExpiryJob` then applies the same `expireIfDue` logic to all due requests: status `CANCELLED`, `cancellation_cause` `SYSTEM_EXPIRY`, and a `HistoryEvent` `EQ_REQUEST_EXPIRED` with `actor_id` NULL (`SYSTEM`) and the computed `expiry_at` in `details`. The same job deletes `revoked_tokens` rows whose `expires_at` has passed (ADR-003).
- **Target for I-04.** The stored status changes within 5 minutes after `expiry_at` in normal operation. Correctness never depends on the sweep.
- **Overdue** is always derived (`ON_LOAN` and `now > return_due_at`). It has no job and no event.

## Alternatives considered

- **`@nestjs/schedule` cron inside the API:** there is no always-on process on Vercel Functions.
- **Vercel Cron:** limited to daily runs on the Hobby plan, which would leave stale statuses for up to 24 h.
- **GitHub Actions schedule:** runs at most every 5 minutes, often late, and is paused in inactive repositories.
- **Expiry written in a PL/pgSQL function:** duplicates business rules and history writing outside the services.
- **Lazy enforcement only:** correct, but untouched requests keep a stale `APPROVED` status in lists and history.
- **Storing `expiry_at`:** it would have to be recomputed on every pickup change, with a risk of inconsistency. The kickoff rejected it.

## Consequences

- **Positive:** I-04 can close with a measurable target. Boundary tests use a fixed `Clock` (pickup − 1 s, pickup, expiry − 1 s, expiry).
- **Negative:** the `pg_cron` and `pg_net` extensions must be enabled, with the job secret kept in Supabase Vault and in Vercel environment settings. If the API is down, the next run catches up because the job is idempotent.
- **History:** `occurred_at` records the processing time, and the exact threshold is kept in `details`.
- **Follow-up:** SM-01 and SD-03 show expiry as a guard on handover and as a system transition.
