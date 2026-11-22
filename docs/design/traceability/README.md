# T20 - Design traceability

**PA3 section 7 / WBS 3.3.5 / [task #58](https://github.com/JuliaTrang/T09-CampusBorrow/issues/58).** Owner: Phuc. Revision 3, 22 November 2026. Status: **ready for team review, with source-owner exceptions recorded**.

This document maps 93 PA2 v2 functional requirements to use cases, screens, components/classes, data and lifecycle evidence. It also covers 12 NFRs, 9 DRs and 20 BRs. The four Could requirements remain Deferred. Original FR wording, priorities, UC/Screen/AC references and test-case statuses are preserved in the [full matrix](fr-matrix.md).

The updated State Diagram is incorporated and R10 is closed. T18 v5.1 is pinned to commit `4ba2c0635f6c519c6a2da3115c67872c0bfde26e` in [PR #71](https://github.com/JuliaTrang/T09-CampusBorrow/pull/71); an agreeing comment has been reported, but a formal Approved review is unconfirmed and merge is pending (R03). This branch starts from main `67109be0c52723c6279eb2a3236330627770f247` and contains T20 only.

## Review scope and evidence levels

| Evidence level            | FR count |
| ------------------------- | -------- |
| Operation / rule evidence | 50       |
| Owner / policy evidence   | 38       |
| Setup design evidence     | 1        |
| Deferred                  | 4        |

Operation/rule evidence refers to declared methods and design policies, not implemented code. Owner/policy evidence identifies responsibility while preserving missing operation detail under R11. Setup design evidence maps the first-Admin seed without inventing a filename or public endpoint. State labels describe behaviour; full PA2, DM-01, class and ADR guards remain authoritative.

Protected routes share SessionGuard/RolesGuard and service ownership checks. CMP-09 supports applicable operations; HistoryService.append participates in its caller transaction. ADR-002 defines public exceptions; the internal expiry job uses its own secret. SD-01 to SD-05 cover UC-01/11/13/18/19 only.

## Functional requirement index

Open a requirement ID to review its full 22-field mapping. Test cases are Pending PA4 (test design); PA5 execution, T19 accessibility and deployment evidence are separate.

| Requirement                       | Priority | UC                                                               | Screen baseline                         | Evidence level            | Follow-ups |
| --------------------------------- | -------- | ---------------------------------------------------------------- | --------------------------------------- | ------------------------- | ---------- |
| [FR-01-01](fr-matrix.md#fr-01-01) | Must     | UC-01                                                            | S01                                     | Operation / rule evidence | None       |
| [FR-01-02](fr-matrix.md#fr-01-02) | Must     | UC-02                                                            | S01                                     | Operation / rule evidence | None       |
| [FR-01-03](fr-matrix.md#fr-01-03) | Must     | UC-01, UC-03, UC-04, UC-05, UC-07, UC-11, UC-12, UC-19, UC-21    | S01; S02; S03; S05; S09; S10; S10a; S12 | Operation / rule evidence | None       |
| [FR-01-04](fr-matrix.md#fr-01-04) | Must     | UC-06                                                            | S11                                     | Owner / policy evidence   | R11        |
| [FR-01-05](fr-matrix.md#fr-01-05) | Must     | UC-01, UC-03, UC-06                                              | S01; S02; S11                           | Owner / policy evidence   | R11        |
| [FR-01-06](fr-matrix.md#fr-01-06) | Must     | UC-03, UC-05, UC-06                                              | S02; S11                                | Owner / policy evidence   | R11        |
| [FR-01-07](fr-matrix.md#fr-01-07) | Must     | UC-01, UC-02, UC-04, UC-05                                       | S01; S02                                | Operation / rule evidence | None       |
| [FR-02-01](fr-matrix.md#fr-02-01) | Must     | UC-08                                                            | S14                                     | Owner / policy evidence   | None       |
| [FR-02-02](fr-matrix.md#fr-02-02) | Must     | UC-08                                                            | S14                                     | Owner / policy evidence   | R11        |
| [FR-02-03](fr-matrix.md#fr-02-03) | Must     | UC-07                                                            | S03                                     | Owner / policy evidence   | R11        |
| [FR-02-04](fr-matrix.md#fr-02-04) | Must     | UC-07, UC-17                                                     | S03; S07; S07b                          | Operation / rule evidence | None       |
| [FR-02-05](fr-matrix.md#fr-02-05) | Must     | UC-09                                                            | S14                                     | Owner / policy evidence   | R11        |
| [FR-02-06](fr-matrix.md#fr-02-06) | Must     | UC-07, UC-10, UC-18                                              | S03; S04; S08                           | Operation / rule evidence | None       |
| [FR-02-07](fr-matrix.md#fr-02-07) | Must     | UC-09, UC-10, UC-18                                              | S14; S04; S08                           | Owner / policy evidence   | R11        |
| [FR-02-08](fr-matrix.md#fr-02-08) | Must     | UC-09, UC-10, UC-11, UC-18, UC-19                                | S14; S04; S05; S08; S09                 | Operation / rule evidence | None       |
| [FR-02-09](fr-matrix.md#fr-02-09) | Must     | UC-07, UC-09, UC-21                                              | S03; S14; S10; S10a; S12                | Owner / policy evidence   | None       |
| [FR-02-10](fr-matrix.md#fr-02-10) | Must     | UC-09, UC-14, UC-22                                              | S14; S06; S13                           | Owner / policy evidence   | None       |
| [FR-02-11](fr-matrix.md#fr-02-11) | Must     | UC-08                                                            | S14                                     | Owner / policy evidence   | R11; R05   |
| [FR-02-12](fr-matrix.md#fr-02-12) | Must     | UC-08, UC-09                                                     | S14                                     | Owner / policy evidence   | R11        |
| [FR-02-13](fr-matrix.md#fr-02-13) | Should   | UC-08                                                            | S14                                     | Owner / policy evidence   | R11        |
| [FR-02-14](fr-matrix.md#fr-02-14) | Should   | UC-08, UC-09                                                     | S14                                     | Owner / policy evidence   | R11        |
| [FR-02-15](fr-matrix.md#fr-02-15) | Should   | UC-08, UC-21                                                     | S14; S12                                | Owner / policy evidence   | R11        |
| [FR-02-16](fr-matrix.md#fr-02-16) | Must     | UC-08, UC-09                                                     | S14                                     | Owner / policy evidence   | R11        |
| [FR-03-01](fr-matrix.md#fr-03-01) | Must     | UC-10                                                            | S04                                     | Owner / policy evidence   | R11        |
| [FR-03-02](fr-matrix.md#fr-03-02) | Must     | UC-10                                                            | S04                                     | Owner / policy evidence   | R11        |
| [FR-03-03](fr-matrix.md#fr-03-03) | Must     | UC-10                                                            | S04                                     | Owner / policy evidence   | R11        |
| [FR-03-04](fr-matrix.md#fr-03-04) | Must     | UC-11                                                            | S05                                     | Owner / policy evidence   | R11        |
| [FR-03-05](fr-matrix.md#fr-03-05) | Must     | UC-11                                                            | S05                                     | Operation / rule evidence | None       |
| [FR-03-06](fr-matrix.md#fr-03-06) | Must     | UC-11                                                            | S05                                     | Operation / rule evidence | None       |
| [FR-03-07](fr-matrix.md#fr-03-07) | Must     | UC-11                                                            | S05                                     | Operation / rule evidence | None       |
| [FR-03-08](fr-matrix.md#fr-03-08) | Must     | UC-12                                                            | S05                                     | Owner / policy evidence   | R11        |
| [FR-03-09](fr-matrix.md#fr-03-09) | Must     | UC-10, UC-11, UC-12, UC-21                                       | S04; S05; S10; S10a; S12                | Owner / policy evidence   | R11        |
| [FR-03-10](fr-matrix.md#fr-03-10) | Must     | UC-15                                                            | S10                                     | Owner / policy evidence   | R11        |
| [FR-03-11](fr-matrix.md#fr-03-11) | Should   | UC-15                                                            | S10                                     | Owner / policy evidence   | R11; R06   |
| [FR-03-12](fr-matrix.md#fr-03-12) | Must     | UC-15                                                            | S10                                     | Owner / policy evidence   | R11        |
| [FR-03-13](fr-matrix.md#fr-03-13) | Must     | Automatic system expiry; no actor- initiated UC                  | S10; S05 (expiry outcome only)          | Operation / rule evidence | None       |
| [FR-03-14](fr-matrix.md#fr-03-14) | Must     | UC-12, UC-13                                                     | S05; S06                                | Owner / policy evidence   | R11; R13   |
| [FR-03-15](fr-matrix.md#fr-03-15) | Must     | UC-12, UC-13                                                     | S05; S06                                | Owner / policy evidence   | R11; R13   |
| [FR-04-01](fr-matrix.md#fr-04-01) | Must     | UC-13                                                            | S06                                     | Operation / rule evidence | None       |
| [FR-04-02](fr-matrix.md#fr-04-02) | Must     | UC-13                                                            | S06                                     | Operation / rule evidence | None       |
| [FR-04-03](fr-matrix.md#fr-04-03) | Must     | UC-14                                                            | S06                                     | Owner / policy evidence   | R11        |
| [FR-04-04](fr-matrix.md#fr-04-04) | Must     | UC-14                                                            | S06                                     | Owner / policy evidence   | R11        |
| [FR-04-05](fr-matrix.md#fr-04-05) | Must     | UC-16                                                            | S06                                     | Owner / policy evidence   | R11        |
| [FR-04-06](fr-matrix.md#fr-04-06) | Must     | UC-16, UC-21                                                     | S06; S10; S10a; S12                     | Owner / policy evidence   | R11        |
| [FR-05-01](fr-matrix.md#fr-05-01) | Must     | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-05-02](fr-matrix.md#fr-05-02) | Must     | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-05-03](fr-matrix.md#fr-05-03) | Must     | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-05-04](fr-matrix.md#fr-05-04) | Must     | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-05-05](fr-matrix.md#fr-05-05) | Should   | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-05-06](fr-matrix.md#fr-05-06) | Should   | UC-17                                                            | S07; S07b                               | Operation / rule evidence | None       |
| [FR-06-01](fr-matrix.md#fr-06-01) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-02](fr-matrix.md#fr-06-02) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-03](fr-matrix.md#fr-06-03) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-04](fr-matrix.md#fr-06-04) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-05](fr-matrix.md#fr-06-05) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-06](fr-matrix.md#fr-06-06) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-07](fr-matrix.md#fr-06-07) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-08](fr-matrix.md#fr-06-08) | Must     | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-06-09](fr-matrix.md#fr-06-09) | Should   | UC-18                                                            | S08                                     | Operation / rule evidence | R13        |
| [FR-07-01](fr-matrix.md#fr-07-01) | Must     | UC-19                                                            | S09                                     | Operation / rule evidence | None       |
| [FR-07-02](fr-matrix.md#fr-07-02) | Must     | UC-19                                                            | S09                                     | Operation / rule evidence | None       |
| [FR-07-03](fr-matrix.md#fr-07-03) | Must     | UC-19                                                            | S09                                     | Operation / rule evidence | None       |
| [FR-07-04](fr-matrix.md#fr-07-04) | Must     | UC-19                                                            | S09                                     | Operation / rule evidence | None       |
| [FR-07-05](fr-matrix.md#fr-07-05) | Must     | UC-20                                                            | S10                                     | Owner / policy evidence   | R11        |
| [FR-07-06](fr-matrix.md#fr-07-06) | Must     | UC-19                                                            | S09                                     | Operation / rule evidence | None       |
| [FR-07-07](fr-matrix.md#fr-07-07) | Must     | UC-18; UC-19                                                     | S08; S09                                | Operation / rule evidence | None       |
| [FR-07-08](fr-matrix.md#fr-07-08) | Must     | UC-19                                                            | S09                                     | Owner / policy evidence   | None       |
| [FR-07-09](fr-matrix.md#fr-07-09) | Must     | UC-19, UC-20                                                     | S09; S10                                | Owner / policy evidence   | R11        |
| [FR-08-01](fr-matrix.md#fr-08-01) | Must     | UC-21                                                            | S12; S10a                               | Operation / rule evidence | R05        |
| [FR-08-02](fr-matrix.md#fr-08-02) | Must     | UC-21                                                            | S12; S10a                               | Operation / rule evidence | R05        |
| [FR-08-03](fr-matrix.md#fr-08-03) | Must     | UC-21                                                            | S12; S10a                               | Operation / rule evidence | R05        |
| [FR-08-04](fr-matrix.md#fr-08-04) | Must     | UC-21                                                            | S12; S10a                               | Operation / rule evidence | R05        |
| [FR-08-05](fr-matrix.md#fr-08-05) | Must     | UC-21                                                            | S10; S10a                               | Operation / rule evidence | R05        |
| [FR-08-06](fr-matrix.md#fr-08-06) | Must     | UC-21                                                            | S12                                     | Operation / rule evidence | R05        |
| [FR-08-07](fr-matrix.md#fr-08-07) | Must     | UC-21                                                            | S12                                     | Operation / rule evidence | R05        |
| [FR-08-08](fr-matrix.md#fr-08-08) | Must     | UC-21                                                            | S12; S10a                               | Owner / policy evidence   | R05        |
| [FR-08-09](fr-matrix.md#fr-08-09) | Should   | UC-21                                                            | S12                                     | Operation / rule evidence | R05        |
| [FR-09-01](fr-matrix.md#fr-09-01) | Must     | UC-03                                                            | S02                                     | Owner / policy evidence   | R11        |
| [FR-09-02](fr-matrix.md#fr-09-02) | Must     | UC-01, UC-04                                                     | S01; S02                                | Operation / rule evidence | None       |
| [FR-09-03](fr-matrix.md#fr-09-03) | Must     | UC-04, UC-14                                                     | S02; S06                                | Owner / policy evidence   | None       |
| [FR-09-04](fr-matrix.md#fr-09-04) | Should   | UC-04                                                            | S02                                     | Operation / rule evidence | None       |
| [FR-09-05](fr-matrix.md#fr-09-05) | Must     | UC-05                                                            | S02                                     | Operation / rule evidence | None       |
| [FR-09-06](fr-matrix.md#fr-09-06) | Must     | UC-03, UC-04, UC-05, UC-06, UC-21                                | S02; S11; S12 (Admin only)              | Owner / policy evidence   | R11; R05   |
| [FR-09-07](fr-matrix.md#fr-09-07) | Must     | UC-04                                                            | S02                                     | Operation / rule evidence | None       |
| [FR-09-08](fr-matrix.md#fr-09-08) | Must     | Setup prerequisite; UC-06 rejects public privileged registration | Setup process; no public screen         | Setup design evidence     | R05        |
| [FR-09-09](fr-matrix.md#fr-09-09) | Should   | UC-22                                                            | S13                                     | Operation / rule evidence | None       |
| [FR-09-10](fr-matrix.md#fr-09-10) | Should   | UC-22                                                            | S13                                     | Operation / rule evidence | None       |
| [FR-09-11](fr-matrix.md#fr-09-11) | Should   | UC-22                                                            | S13                                     | Operation / rule evidence | None       |
| [FR-09-12](fr-matrix.md#fr-09-12) | Should   | UC-22                                                            | S13                                     | Operation / rule evidence | None       |
| [FR-10-01](fr-matrix.md#fr-10-01) | Could    | None (Could, deferred)                                           | None (deferred)                         | Deferred                  | None       |
| [FR-10-02](fr-matrix.md#fr-10-02) | Could    | None (Could, deferred)                                           | None (deferred)                         | Deferred                  | None       |
| [FR-11-01](fr-matrix.md#fr-11-01) | Could    | None (Could, deferred)                                           | None (deferred)                         | Deferred                  | None       |
| [FR-11-02](fr-matrix.md#fr-11-02) | Could    | None (Could, deferred)                                           | None (deferred)                         | Deferred                  | None       |

## State-diagram alignment

[Updated SM-01 to SM-04](sources/SM-01-04-updated.png) supersedes the old image. Cancellation, CO_02 and initial resource-state corrections are mapped.

| Diagram                | Mapped transitions / concern                                                                  | Requirement coverage                                                 | Review result                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SM-01 EquipmentRequest | Submit; approve/reject; approved Borrower/staff cancel; expiry; handover; return; CO_01/CO_02 | FR-03-01..15; FR-04-01..06; FR-08-03; FR-09-09..12                   | APPROVED cancellation and guarded CO_02 are present. SYSTEM_EXPIRY is preserved. Expired/Overdue are computed. Full eligibility and transaction guards remain PA2/ADR evidence.           |
| SM-02 RoomBooking      | Submit; approve/reject; Pending/Approved Borrower cancel; CO_04                               | FR-05-01..06; FR-06-01..09; FR-07-01..09; FR-08-04; FR-09-09..12     | Cancellation requires now &lt; startAt; optional reason. Half-open overlap and stale/conflict losers staying Pending are explicit. Approved bookings remain after room readiness changes. |
| SM-03 Account          | Initial Active; deactivate/reactivate; role/password events                                   | FR-01-03/04/07; FR-09-01..08; NFR-05                                 | Role/password changes do not add statuses; token_version invalidates old JWTs. Setup, public-registration restrictions and last-Admin/obligation guards remain ADR/PA2 rules.             |
| SM-04 Resource         | Initial Out of service; setOutOfService; restore                                              | FR-02-02/04..12; FR-03-02/04; FR-05-04; FR-06-06; FR-07-07/08; BR-13 | Initial HIDDEN + OUT_OF_SERVICE and required readiness reason are explicit. Visibility and occupancy remain independent. Catalogue validation and audit stay in their existing sources.   |

## Data conventions

| Table              | Key                                             | Conceptual class                       | Convention / constraint                                                                                                                   |
| ------------------ | ----------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| accounts           | id UUID PK                                      | Account                                | username/email case-insensitive unique; display_name, hash, role/status, token_version.                                                   |
| resources          | id UUID PK; code unique                         | Resource -&gt; Equipment/Room          | Shared table; ROOM capacity&gt;=1, EQUIPMENT capacity NULL. Description remains optional in PA2 (R05).                                    |
| equipment_requests | id UUID PK; borrower/resource UUID FKs          | EquipmentRequest                       | Reservation/loan are states, not separate tables; computed expiry/overdue; SYSTEM_EXPIRY; active-occupancy indexes.                       |
| room_bookings      | id UUID PK; period-code FKs                     | RoomBooking                            | start_at/end_at are server-derived but stored for exclusion checks; no client arbitrary interval.                                         |
| periods            | code natural PK (P1-P8)                         | Period                                 | Fixed timetable; session/start/end/seq; interval derivation via TimetableService.                                                         |
| history_events     | id UUID PK; nullable actor/resource FKs         | HistoryEvent                           | Polymorphic target_id is not a conventional FK; actor_role vocabulary unresolved in R05; content append-only despite updated_at metadata. |
| state_corrections  | id UUID PK; history_event_id UNIQUE NOT NULL FK | StateCorrection                        | admin_id, full CO codes, before/after jsonb, reason, applied_at. No corrected_event_id column invented.                                   |
| revoked_tokens     | jti UUID PK                                     | RevokedToken.id = jti conceptual alias | No separate DB id; account_id UUID FK, expires_at; expired denylist rows removed by ExpiryJob.                                            |

## Review and follow-up register

R03 is an approval/merge integration follow-up. R05/R06/R11/R12/R13 remain source-owner design exceptions, with responsibility and next actions below. No Should requirement is silently deferred.

| ID  | Status                                                       | Scope                                     | Result / next action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Owner                          | Evidence                                                           |
| --- | ------------------------------------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| R01 | T20 mapping completed                                        | All 89 active FRs                         | All 89 active FRs now have source-backed component/class ownership, operation/policy evidence and explicit state/transition evidence; four Could FRs stay Deferred. The 93-row CSV and HTML preserve the PA2 requirement baseline. Completion of traceability is not approval or implementation of upstream designs.                                                                                                                                                                                                                         | T20 / Phuc                     | SRC-07/08/09/10                                                    |
| R02 | Decision resolved                                            | IDs and keys                              | Use UUID domain IDs/FKs, periods.code natural PK, revoked_tokens.jti UUID PK without a surrogate id. SYSTEM_EXPIRY is the selected cause. Historical class-table transcriptions still need source cleanup (R12).                                                                                                                                                                                                                                                                                                                             | Data/Class owners              | SRC-04/05/11                                                       |
| R03 | Integration follow-up - approval unconfirmed / merge pending | T18-related mappings                      | T18 v5.1 / 4ba2c06 is fully mapped, including S14 Manage resources and S05 item operational status/occupancy. The user clarified that PR #71 has an agreeing comment, not a confirmed Approved review. Fetched main 67109be does not contain T18. Record the eventual review/merge separately; recheck mappings only if the merged content changes.                                                                                                                                                                                          | T18 reviewer                   | SRC-03/12                                                          |
| R04 | Validation ownership mapped                                  | FR-06-02/04; FR-03-07; FR-07-02           | TimetableService derives/validates periods; RoomBookingService validates future start/capacity/eligibility; decision services validate trimmed rejection reasons. Table v2 supplies local checks/indexes, not executable cross-table CHECKs. R13 records remaining coordination detail.                                                                                                                                                                                                                                                      | Service / DB owners            | SRC-04; SRC-09 C2/C3; SRC-10 SD-04/05                              |
| R05 | Open - source-owner follow-up recorded                       | Audit vocabulary and optional description | Resolved: resource_id filtering, polymorphic targets, materialized room intervals, correction before/after and audit link. Remaining: CD-02 actorRole uses Role (three account roles), while SYSTEM and setup-origin audit need an explicit representation; Table v2 does not enumerate these actor_role values. PA2 BR-12 permits omitted description while Table v2 says NOT NULL: choose an empty-string mapping or change nullability, without making the UI input mandatory. Full CO codes come from DM-01, not shorthand CO_01..CO_04. | Data/Class owners              | SRC-01 BR-12/FR-09-06; SRC-04; SRC-08 HistoryEvent; SRC-15         |
| R06 | Open - source-owner follow-up recorded                       | FR-03-11 / UC-15                          | Backend ownership is CMP-04/06. PA2 baseline S10 is Borrower My requests and does not establish a staff route. Retain the baseline in its own column and flag the unresolved staff entry; do not silently add a T18 button or defer this Should requirement. Updated SM-01 confirms the required staff transition; it does not define a UI screen. This follow-up is retained rather than changing the six-screen T18 scope.                                                                                                                 | UI / requirement owners        | SRC-01; SRC-02 screen list; SRC-07                                 |
| R07 | Design entry resolved                                        | FR-09-08                                  | ADR-003 specifies a first-Admin setup seed using environment variables. No public privileged registration and no invented controller method or script filename. Implementation evidence remains for PA4. Audit-origin representation is tracked in R05.                                                                                                                                                                                                                                                                                      | Setup / Auth owner             | SRC-11 ADR-003 First Admin                                         |
| R08 | Baseline resolved                                            | 13 amendments / NFR-09 / BR-20            | Use current PA2 v2, which supersedes the older 12-item PA3 template. The historical Section 8 review contains item 13. Equipment losing requests are auto-rejected after a successful approval; room losers remain Pending. No new priority or requirement wording is introduced.                                                                                                                                                                                                                                                            | Requirements / PA3 integrator  | SRC-01; SRC-06; SRC-11 ADR-004                                     |
| R09 | Supplemental mapping completed                               | 12 NFRs, 9 DRs, 20 BRs                    | Responsibilities, data/architecture evidence and planned verification are recorded. No availability, restore, performance, security, usability or accessibility pass is claimed.                                                                                                                                                                                                                                                                                                                                                             | T20 / PA4 / T19 owners         | SRC-04/07/09/11/14/15                                              |
| R10 | Resolved - updated state revision mapped                     | SM-01 to SM-04                            | StateDiagram(upd).png supplies SM-01 APPROVED cancellation by Borrower/staff, guarded RETURNED -&gt; ON_LOAN CO_02, SM-02 APPROVED Borrower cancellation before start, and SM-04 initial HIDDEN + OUT_OF_SERVICE. SYSTEM_EXPIRY, computed Expired/Overdue, room conflict losers remaining PENDING and account token_version semantics were also inspected. Each active FR now has a state evidence entry or an explicit explanation that no new transition applies.                                                                          | T20 / Phuc (mapping complete)  | SRC-13 updated image; SRC-01; SRC-11 ADR-004/005; SRC-12; SRC-15   |
| R11 | Open - source-owner follow-up recorded                       | Rows marked R11                           | CMP-D establishes owners, but CD-01/C2 omit equipment submit/read/edit/cancel/return/overdue operations; account registration/create and catalogue CRUD/search/status operations are also not declared; room cancel is absent. These rows use Owner / policy evidence. Existing methods are cited only where actually declared. New state-diagram labels (submit, return, cancelByBorrower/cancelByStaff) describe behaviour and do not supply missing CD-01 signatures.                                                                     | Class specification owner      | SRC-07; SRC-08 CD-01; SRC-09 C2 open operations                    |
| R12 | Open - source-owner follow-up recorded                       | ERD/Class/Sequence wording                | Current Table v2 resolves the old bigint and missing-column transcription. C6-C8 and the E-01..E-10 table still describe an older ERD. CD-02 RevokedToken.id is a conceptual alias of jti, not a database id column. Class source types also need review for proposedPickupAt nullability and state enum/string representation. T20 uses the selected v2 contract and preserves this discrepancy.                                                                                                                                            | Class/Data owners              | SRC-04/05/08/09/10                                                 |
| R13 | Open - source-owner follow-up recorded                       | Room submit; expiry refusal               | SD-04/4.4 still leaves submission-versus-approval serialization to the DB design. ADR-004 approved-interval exclusion alone does not establish that pending submission rechecks atomically. The 4.4 expiry open point also remains: refusal must not roll back the expiry update/audit; T18 v5.1 states the required committed-expiry outcome. Map both sources without claiming the older SD is already reconciled.                                                                                                                         | Sequence / service / DB owners | SRC-10 4.4 open points; SRC-11 ADR-004/005; SRC-12 G04/G08/S05/S06 |

## Nonfunctional requirements

PA2 section 9 assigns test design to PA4 and execution to PA5. Prototype/manual checks may be performed earlier. None of the planned verification below is claimed to have passed.

| ID     | PA2 requirement summary                                                        | Responsibility                                                                                    | Design mapping                                                                                                                                                                                                                                  | Planned verification / limitation                                                                                                                                                          | Evidence                                                                                  |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| NFR-01 | Read API P95 ≤1.0 s with 200 users and reference data                          | CMP-03/04/05/06/09; query services, PrismaService                                                 | Table v2 read indexes; ADR-006 preview/staging with separate development DB and PA2 reference dataset; performance is unmeasured.                                                                                                               | PA4 test design / PA5 execution: 200 users, 2-minute ramp-up, 10-minute steady state after 10 warm-up requests; read P95 &lt;=1.0 s; retain JMeter report.                                 | SRC-01; SRC-04 pp.8-9; SRC-11 ADR-006; SRC-14                                             |
| NFR-02 | Write API P95 ≤2.0 s with 50 users                                             | CMP-04/05/06/09; mutating services and transactional history                                      | ADR-004 bounded resource transactions; ADR-006 staging dataset; no production load test is claimed.                                                                                                                                             | PA4 test design / PA5 execution: 50 users, 5-minute mixed-write steady state; P95 &lt;=2.0 s per operation; retain report.                                                                 | SRC-01; SRC-09 C2/C3/C4; SRC-11 ADR-004/006                                               |
| NFR-03 | 100% protected endpoints enforce session, role and owner; 401/403              | SessionGuard, RolesGuard and service ownership checks; AccountService                             | ADR-002 public exceptions: login, Borrower registration, health and secret-authenticated job route. Protected user routes require active session/current role; a user cookie never authorizes the job.                                          | PA4 test design / PA5 execution: direct endpoint role/owner matrix, inactive/revoked/expired sessions; Admin denied UC-12; wrong/missing job secret -&gt;401 with no execution.            | SRC-07; SRC-09 supporting SessionGuard; SRC-11 ADR-002/003/005                            |
| NFR-04 | bcrypt cost ≥10; HttpOnly Secure JWT cookie; ≤24 h; no secrets in logs         | CMP-01/02 AuthService/AccountService; SessionGuard                                                | ADR-003/C1: bcrypt cost 12 over base64(SHA-256 UTF-8 password); HS256 JWT 24h, HttpOnly/Secure/SameSite=Lax; token_version and jti denylist. No secrets in logs.                                                                                | PA4 test design / PA5 execution: long Unicode password boundary, exact password preservation, cookie inspection, expiry boundary, logout/security-change invalidation; no executed result. | SRC-04; SRC-09 C1; SRC-11 ADR-003                                                         |
| NFR-05 | Inactive account rejected on next protected request with 401                   | CMP-01 SessionGuard; CMP-02 AccountService                                                        | AccountService.changeSecurity increments tokenVersion; SessionGuard reads ACTIVE state and current version on each protected request. Reactivation does not restore old sessions.                                                               | PA4 test design / PA5 execution: deactivate then reuse old cookie -&gt;401; reactivate then reuse old cookie still invalid.                                                                | SRC-08 CD-01; SRC-09 supporting SessionGuard; SRC-11 ADR-003; SRC-13 state/guard context  |
| NFR-06 | HTTPS; invalid/oversized input gets 4xx; ZAP zero High risk                    | Controllers, CommonModule HttpExceptionFilter; deployment configuration                           | DEP-D/ADR-006 HTTPS/TLS and same-origin /api rewrite; ADR-004 constraint/version errors -&gt;409; PA2 input errors remain4xx. DTO/body-size limits are implementation details still to specify.                                                 | PA4 test design / PA5 execution: HTTPS/redirect checks, malformed/oversized inputs, ZAP zero High risk. No deployment/security pass claimed.                                               | SRC-11 ADR-002/004/006; SRC-14; SRC-12 G03/G05                                            |
| NFR-07 | Availability ≥99.0% 07:00–22:00 UTC+7, announced-maintenance exception         | Deployment operations; API /api/health with DB round trip                                         | ADR-006: UptimeRobot every 5 minutes, alerts, business-window logs 07:00-22:00 UTC+7; production Supabase plus separate preview DB. Health probing keeps DB active, not functions warm.                                                         | Export monitor logs and evaluate PA2 availability/maintenance rules; actual &gt;=99.0% result pending deployment.                                                                          | SRC-01; SRC-11 ADR-006; SRC-14                                                            |
| NFR-08 | Daily backup; RTO ≤2 h; RPO ≤24 h                                              | Database/operations; encrypted backup and restore workflow                                        | ADR-006: daily 02:00 UTC+7 pg_dump piped into age, encrypted artifact retained7days; sole backup on selected Free plan. Public key in repo, private keys with Trang/Minh. Missed schedule can breach RPO; weekly backup checks track that risk. | Restore drill into a new DB, verify counts, measure RTO&lt;=2h and backup age/RPO&lt;=24h. Match pg_dump client/server compatibility; no existing backup or successful restore asserted.   | SRC-01; SRC-11 ADR-006; SRC-14                                                            |
| NFR-09 | 20 concurrent conflicting approvals; at most one succeeds                      | CMP-04/05/06/09; EquipmentRequestService.decide, RoomBookingService.decide, HistoryService.append | ADR-004 equipment lock+partial uniques; room APPROVED exclusion; consistent history. Equipment winner rejects other Pending requests; room conflicts preserve Pending. Half-open adjacency permitted.                                           | PA4:20 concurrent conflicting approvals,10 repetitions per resource type; check one winner, loser outcomes, adjacent intervals, audit rollback.                                            | SRC-01; SRC-04; SRC-09 C2/C3; SRC-10 SD-02/05; SRC-11 ADR-004; SRC-13 state/guard context |
| NFR-10 | No page horizontal scrolling at 360–1920 px; latest two major browser versions | CTN-01 frontend; six T18 screens plus wider PA2 key screens                                       | T18 G06 specifies responsive layouts; no final frontend class names or viewport pass invented. Current images are reference renders.                                                                                                            | PA4/T19:360/768/1920px, latest two major supported browser versions; no page-wide horizontal scrolling. Await T18 review separately.                                                       | SRC-01; SRC-12 G06; SRC-14 browser node                                                   |
| NFR-11 | Text ≥4.5:1; labels, keyboard order/focus and field/fix errors; audit evidence | CTN-01 frontend; error-feedback support in CommonModule                                           | T18 G03/G06 and field/error contracts; keyboard focus is a required application behavior, not proof supplied by the fixed Penpot prototype.                                                                                                     | T19: text contrast&gt;=4.5:1, labels, logical Tab/focus, field/fix errors, axe/Lighthouse&gt;=90 plus manual checks; no conformance pass.                                                  | SRC-01; SRC-12 G03/G06                                                                    |
| NFR-12 | At least 4/5 first-time Borrowers submit within 3 minutes unaided              | CTN-01 request flows; CMP-04/05                                                                   | S04/S08 and SF-01 N2; Penpot fixed examples are design evidence, not a completed first-use study.                                                                                                                                               | Planned prototype study / PA5 application study with 5 first-time Borrowers; at least4 submit unaided within3minutes; results pending.                                                     | SRC-01; SRC-03; SRC-12                                                                    |

## Operational design handoff

| Concern                  | Source                       | Selected design                                                                                                                                                                              | Verification / remaining detail                                                                                                                |
| ------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Topology / environments  | ADR-006; DEP-D               | Vercel web+api in Singapore; same-origin /api rewrite; Supabase production and separate preview/development project; CI PostgreSQL service.                                                  | Provisioning and load/security tests still pending.                                                                                            |
| Expiry job               | ADR-005; DEP-D; FR-03-13..15 | pg_cron every minute -&gt; pg_net -&gt; POST /api/internal/jobs/expire with constant-time secret check. Correctness uses locked enforcement on access; normal stored-state target &lt;=5min. | Missing/wrong secret -&gt;401; user cookie grants no access; Vault/Vercel secrets; inspect asynchronous job failures; no ON_LOAN expiry.       |
| Monitoring               | ADR-006; NFR-07              | UptimeRobot /api/health (DB round trip),5-minute interval, alerts and business-window logs.                                                                                                  | Export logs; do not infer uptime from the diagram or use probes as a function-warmth guarantee.                                                |
| Backup / restore         | ADR-006; NFR-08              | 02:00 UTC+7 daily pg_dump \| age; encrypted artifacts7days; only selected Free-plan backup; private keys outside repo.                                                                       | Restore drill records time/counts. A late/missed run may violate RPO; the stale ADR sentence that any late run still meets RPO is not adopted. |
| Connections / migrations | ADR-006; DEP-D               | Runtime transaction pooler :6543; ADR-006 calls for direct migration connection. DEP-D also labels session-mode :5432 for migrations/backup.                                                 | Pin the actual DIRECT_URL/backup route during deployment setup; do not claim both routes are identical or already configured.                  |

## Domain requirements

| ID    | Concern                          | Mapped components                         | Data design                                                                | Screen references (T18 approval unconfirmed)  | Evidence / follow-up                                            |
| ----- | -------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| DR-01 | Resource identity                | CMP-03/04/05/06                           | resources and all referring request/history tables; stable IDs; R02        | S04-01; S08-01; external S03/S14              | CD-02; Table v2 UUID / resource code; R02                       |
| DR-02 | Reservation versus physical loan | CMP-04                                    | equipment_requests APPROVED vs ON_LOAN; no separate reservation/loan table | S05-03; S06-02/03                             | C2/C6; SD-02/03; ADR-004; SRC-13 updated state mapping          |
| DR-03 | Actual return and occupancy      | CMP-04/06                                 | returned_at/by and RETURNED transition; occupancy persists until receipt   | S06-04/05                                     | C6; ADR-004; R11 return detail; SRC-13 updated state mapping    |
| DR-04 | Room use and capacity            | CMP-05                                    | room_bookings + periods + resources.capacity; server interval/validation   | S08; S09                                      | C3/C7; SD-04/05; Table v2 rooms/periods                         |
| DR-05 | Independent resource properties  | CMP-03/04/05                              | resources.visibility / operational_status; occupancy derived from requests | S04-01/05; S06-02/04; S08-01; S09-02          | CD-02 Resource; DM-01 D03; SRC-13 updated state mapping         |
| DR-06 | Expiry and overdue distinction   | CMP-04/08                                 | Capped expiry for APPROVED; overdue only effective unreturned loan         | S05-07; S06-02/05                             | C6; ADR-005; no overdue job/event; SRC-13 updated state mapping |
| DR-07 | External physical activities     | CMP-02/04                                 | External identity/receipt verification; recorded actor and timestamps      | S06-03/04; S02 reset outside T18              | C2; CD-01 AccountService.changeSecurity; PA2 physical checks    |
| DR-08 | Business event evidence          | CMP-06/07 and all mutation services       | history_events; state_corrections; source records retained                 | G04/G08; successful decision/receipt feedback | C4/C5/C8; ADR-002; Table v2 history/corrections; R05            |
| DR-09 | Consistent business time         | CMP-09 Clock; all time-sensitive services | timestamptz UTC and UTC+7 display; server decision time                    | G02; S04/S05/S06/S08/S09                      | ADR-005 Clock/timestamptz/half-open; TimetableService           |

## Business rules

| ID    | Rule                                 | Mapped responsibility         | Data and enforcement                                                        | Screen references (T18 approval unconfirmed)           | Evidence / follow-up                                                                                               |
| ----- | ------------------------------------ | ----------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| BR-01 | Roles and equal RM authority         | CMP-01 and protected services | accounts.role; service permissions                                          | G01; S05-06 RM-only edit; S09 equal checks             | ADR-002/003; CD-01 guards; UC-12 exception retained                                                                |
| BR-02 | Account creation and access          | CMP-01/02                     | accounts; public Borrower only                                              | S01; S11/S02 outside T18                               | ADR-003; CMP-02 owner; R11 registration/create details                                                             |
| BR-03 | Fixed room periods                   | CMP-05 TimetableService       | periods; room_bookings; half-open interval                                  | S08-02..05; S09-02/03; period reference                | C3; TimetableService; SD-04; periods.code                                                                          |
| BR-04 | Equipment pickup expiry              | CMP-04/08/09                  | min(pickup+24h,return); latest state/time                                   | S05-06/07; S06-02/03                                   | C2/C6; ADR-005; R13 expiry-refusal transaction                                                                     |
| BR-05 | Lifecycle and eligibility safeguards | CMP-01/03/04/05/07            | Current requests/resources/accounts; conditional reason rules               | G01/G03/G04; S04/S05/S06/S08/S09                       | C2/C3/C5; ADR-004; Table v2 conditional validation                                                                 |
| BR-06 | Account identifiers                  | CMP-01/02                     | Case-insensitive username/email; normalized display name                    | S01-01; account forms outside T18                      | C1; ADR-003; Table v2 unique username/email indexes                                                                |
| BR-07 | Password policy                      | CMP-01/02                     | Exact input; 15–64 chars; no composition rule/truncation                    | S01-02; create/reset forms outside T18                 | C1; ADR-003 bcrypt prehash; R11 account create validation                                                          |
| BR-08 | Role changes with obligations        | CMP-02/04/05                  | Check Pending/valid Approved/unreturned/not-ended obligations               | S02 outside T18; no automatic cancellation             | CD-01 AccountService.changeSecurity; 4.2 AccountModule; obligation queries not expanded                            |
| BR-09 | Manual password reset verification   | CMP-02                        | External identity check; no uploaded documents; session invalidation        | S02 outside T18; S01 session return                    | CD-01 AccountService.changeSecurity; ADR-003; external verification remains human                                  |
| BR-10 | Session lifecycle                    | CMP-01/02/08                  | 24-hour JWT, token_version and revoked_tokens                               | S01-06; G01                                            | ADR-003/005; C1; revoked_tokens.jti                                                                                |
| BR-11 | Administrative account boundaries    | CMP-02                        | No self-deactivation/demotion; retain last active Admin atomically          | S02 and setup outside T18                              | 4.2 AccountModule; ADR-003 setup/security; no public privileged path                                               |
| BR-12 | Catalog identity and validation      | CMP-03                        | resources; immutable code/type; global uniqueness; capacity                 | S04-01/S08-01 read-only; S14 inputs outside T18; R05   | CD-02 Resource; Table v2; R05 optional description                                                                 |
| BR-13 | Publication and operational state    | CMP-03/04/05                  | Independent visibility/readiness/occupancy; initial Hidden + Out of service | S04-05; S06-02/04; S08-01; S09-03/07                   | DM-01 D03; SRC-01 default Hidden+Out of service; SRC-13 SM-04 initial Hidden + Out of service verified; R10 closed |
| BR-14 | Catalog search and filters           | CMP-03                        | Role scope before counts/pagination; code order; 20/page                    | S03 outside T18                                        | CMP-D UC-07; R11 catalogue search signature not declared                                                           |
| BR-15 | Editing with active obligations      | CMP-03/04/05                  | Resource/request dependencies at save time; no bulk cancellation            | S14 outside T18; Should fallback retained              | DM-01; ADR-004; R11 catalogue mutation signatures                                                                  |
| BR-16 | Status reasons and privacy           | CMP-03/06                     | Staff-only reason; preserve historical reason after clearing current one    | S04/S08 omit internal reasons; S14/S12 external        | DM-01; C4; Table v2 out_of_service_reason; R11 catalogue setter details                                            |
| BR-17 | Concurrent changes                   | CMP-03/04/05/07/09            | version check plus current dependencies; transactions                       | G04; S05/S06/S09 conflicts; external S14/S13           | ADR-004; C2/C3/C5; Table v2 versions/indexes                                                                       |
| BR-18 | Catalog scope and details            | CMP-03                        | Individual items, no deletion/stock quantity/upload workflow                | S04-01; S08-01; external catalogue                     | DM-01; CD-02 Resource/Equipment/Room; no stock/deletion workflow                                                   |
| BR-19 | Business history and disclosure      | CMP-06 and mutation services  | Append-only evidence; role/owner predicates; no click logging               | G08; request outcomes; S10a/S12 external               | C4 HistoryService; ADR-002; R05 system/setup actor vocabulary                                                      |
| BR-20 | Controlled corrections               | CMP-07/06/04/05               | CO-01..CO-04 guards; immutable evidence; corrected effective values         | S13 outside T18; no arbitrary event-time editor on S06 | C5/C8; DM-01 CO-01..CO-04; ADR-004/005; SRC-13 SM-01 CO_02 and SM-02 CO_04 verified; R10 closed                    |

## Source register

Repository references are pinned to the reviewed commits. The five shared source snapshots below are unchanged copies supplied for T20 review, not declarations that their owning design tasks are approved. Their SHA-256 values identify the exact input. Historical source SRC-06 is listed by filename and fingerprint only; current PA2 v2 governs its incorporated requirements.

### SRC-01 - PA2 v2 requirements baseline

Current FR/AC/UC/BR/DR/NFR wording and priorities; submitted PA2 and older PA3 templates do not override it.

- [T09-PA2-v2.docx.pdf](sources/PA2-v2-requirements.pdf)
  SHA-256: `d26d4fb7e33e53bc1d1fdee4ef57f7130a72367ac81ea297fd0444b912c5f32e`.

### SRC-02 - Kickoff vocabulary

Module, class, screen and diagram IDs. Legacy RevokedToken.id means the JWT jti, not a second database key.

- [T09-CampusBorrow/docs/design/kickoff/PA3-Kickoff.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/kickoff/PA3-Kickoff.md)
  SHA-256: `829158c49e4901cc816bc80b5ac3af52f67bc1977f5e40c2aad6586d608df9c2`.

### SRC-03 - SF-01 screen-flow handoff

N1/N2 are navigation design choices; T18 approval remains separate.

- [T09-CampusBorrow/docs/design/screen-flow/README.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/screen-flow/README.md)
  SHA-256: `4ac024a57f1d3e0d73b12b891ec93943839eb26856914834a2b8f183593c364b`.

### SRC-04 - Table Specification v2

Pages 1-7: eight tables; 8-9: indexes/constraints; 10: ERD update checklist. UUID, jti PK, periods.code, SYSTEM_EXPIRY.

- [T09-PA3-5.2-5.3-Table-Specification-and-Indexes-v2.pdf](sources/table-specification-v2.pdf)
  SHA-256: `5d58a181e7241a3fc66c57f5c7f2bd1a1bfae72ac74f6f2ef809f557e34e4f93`.

### SRC-05 - Selected ERD-01 baseline

User-selected older ERD reconciled with Table Spec v2; the unselected alternative ERD is not used.

- [CampusBorrow ERD-01 3NF UUID.png](sources/ERD-01-selected.png)
  SHA-256: `d18c0d1614dd6838f969f00ef40d0b25245213201830d1f4a225ff0bfcad2f4f`.

### SRC-06 - Section 8 amendment review

Historical 13-item review; use the incorporated PA2 v2 wording as authoritative, including NFR-09 and CO guards.

- `PA3-Team-Review/PA3_Section_8_Team_Review.html` (historical external comparison only)
  SHA-256: `7a4eca0bdaed7841ec82946f539b052cb0d96f038c0b05c4f6e56841d8f7d5e0`.

### SRC-07 - Component responsibilities

Nine modules; protected-route guards, exported service boundaries and common infrastructure.

- [T09-CampusBorrow/docs/design/diagrams/CMP-D_component.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/CMP-D_component.drawio)
  SHA-256: `4541bbb74366fbaaffe30f84e34a8095224accbd1b6d0c08ba97fbc94cb94ea8`.
- [T09-CampusBorrow/docs/design/pa3/3.3-3.4-drive-aligned.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/pa3/3.3-3.4-drive-aligned.md)
  SHA-256: `5e3c7d3b152ca13598eb8266923a695945c0c6db41a3ef19684e854f77e1e78d`.

### SRC-08 - Class diagrams

Actual declared classes and operations. These are design proposals, not implemented APIs.

- [T09-CampusBorrow/docs/design/diagrams/CD-01_component-classes.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/CD-01_component-classes.drawio)
  SHA-256: `b48860a50a5cb9e8d5893388d7da53cdd85d101de8d832e461ba41603985bbd1`.
- [T09-CampusBorrow/docs/design/diagrams/CD-02_entities.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/CD-02_entities.drawio)
  SHA-256: `ca8df80b211b689ae328e1ccf8e498b3ea362e63bbcf2578d700f12d6d3389ef`.
- [T09-CampusBorrow/docs/design/pa3/4.2-class-diagram.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/pa3/4.2-class-diagram.md)
  SHA-256: `75cb5deb1b0a828d589359229d8095d36ad255e0f644788cdcdccb5072caf2bd`.

### SRC-09 - Class specifications

C1 Auth, C2 EquipmentRequestService, C3 RoomBookingService, C4 History, C5 Correction, C6-C8 entities, supporting SessionGuard/TimetableService. Historical ERD transcription differences are recorded in R12.

- [T09-CampusBorrow/docs/design/pa3/4.3-class-specifications.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/pa3/4.3-class-specifications.md)
  SHA-256: `32bea1d98813fc9f6a90cd6ff005478bd6d2c9fa2c9c88bb27ec0344b0d94251`.

### SRC-10 - Sequence evidence

All five diagrams exist. They cover UC-01/11/13/18/19; no SD is invented for other UCs.

- [T09-CampusBorrow/docs/design/pa3/4.4-sequence-diagrams.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/pa3/4.4-sequence-diagrams.md)
  SHA-256: `2b89e0b013b3ed54f411538aaf4755ee26d5e07db9468706699c8a2a454dfde1`.
- [T09-CampusBorrow/docs/design/diagrams/SD-01_uc01-sign-in.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/SD-01_uc01-sign-in.drawio)
  SHA-256: `8ff6f99e95dd7a8a33938c54ee72bf4489b349965b1ebf30815b39c0b33cc9de`.
- [T09-CampusBorrow/docs/design/diagrams/SD-02_uc11-approve-equipment.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/SD-02_uc11-approve-equipment.drawio)
  SHA-256: `e65b02bcee9695bc61a63839c9e11d2741d5d673960cbb1f77bfa4e962cac476`.
- [T09-CampusBorrow/docs/design/diagrams/SD-03_uc13-handover.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/SD-03_uc13-handover.drawio)
  SHA-256: `7d70a3fb31ed3f6c9893f3e1e6bcd0c6f4a69552a94e6398a634f6d9075d21eb`.
- [T09-CampusBorrow/docs/design/diagrams/SD-04_uc18-submit-room-booking.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/SD-04_uc18-submit-room-booking.drawio)
  SHA-256: `353f23d6f6a7688aa86b9e2b8d7d662c1dd939b1bcfd16631670b586f01ca795`.
- [T09-CampusBorrow/docs/design/diagrams/SD-05_uc19-decide-room-booking.drawio](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/diagrams/SD-05_uc19-decide-room-booking.drawio)
  SHA-256: `9961ddb5e1c5191cc27f2a25a936523ec25b00251de5d1e5fbc304b58311fe7f`.

### SRC-11 - Accepted architecture decisions

Design decisions as recorded in this project; hosting plan capabilities and operational results still require implementation-time verification.

- [T09-CampusBorrow/docs/design/adr/ADR-001-tech-stack.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-001-tech-stack.md)
  SHA-256: `7eaf46afe67a440863ce53d6a799f263b7dc265158ff151499524de7f7249507`.
- [T09-CampusBorrow/docs/design/adr/ADR-002-layered-modular-monolith.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-002-layered-modular-monolith.md)
  SHA-256: `bd84b1ad12182932d6dacac6e388b0c6d17cc4b916661b64852bb2f7dfa02c1b`.
- [T09-CampusBorrow/docs/design/adr/ADR-003-jwt-cookie-auth.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-003-jwt-cookie-auth.md)
  SHA-256: `42e978a8cd1240101331b47331a063e34dc543f2470704f3f8a894edaed95da2`.
- [T09-CampusBorrow/docs/design/adr/ADR-004-database-concurrency-control.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-004-database-concurrency-control.md)
  SHA-256: `2e5cea34a84f71c4063a18205b481aaa31014164d9e3175c2b1aeabc7c5b9cab`.
- [T09-CampusBorrow/docs/design/adr/ADR-005-time-and-pickup-expiry.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-005-time-and-pickup-expiry.md)
  SHA-256: `984bdb50634d294fe7260b362d1c900f6f8766ae4c28d4a75b64ad2463a1a790`.
- [T09-CampusBorrow/docs/design/adr/ADR-006-hosting-environments-backup.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/adr/ADR-006-hosting-environments-backup.md)
  SHA-256: `0819f73f8dbff4e35611bfc48af0e50220d218925a29182dfebe34b27f77434f`.

### SRC-12 - Current T18 / Penpot v5.1

T18 v5.1 source 4ba2c06; live Penpot update confirmed. On 22 November the user clarified that there is an agreeing comment but formal GitHub Approved review is not confirmed. PR #71 is not included in the fetched main snapshot. Traceability uses this exact source revision; merge is a separate integration step.

- [T09-CampusBorrow/docs/design/screen-specifications/README.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/4ba2c0635f6c519c6a2da3115c67872c0bfde26e/docs/design/screen-specifications/README.md)
  SHA-256: `e084419daf4b0bc8a03b60df8e776faac9dc84bb8d7cb4c8d074c0f5a29751ab`.
- [T09-CampusBorrow/docs/design/penpot-t18/README.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/4ba2c0635f6c519c6a2da3115c67872c0bfde26e/docs/design/penpot-t18/README.md)
  SHA-256: `42a41c95facae4e3e65e032dd170e06c46322ab341fde1ffd76570b0c62bbd74`.

### SRC-13 - Updated SM-01 to SM-04

Supplied 22 November 2026; visually compared with PA2 v2, T18, DM-01 and ADR-004/005. Replaces CampusBrrow StateDiagram.png for this T20 revision. Missing APPROVED cancellation, guarded CO_02 and initial HIDDEN + OUT_OF_SERVICE corrections are incorporated. Behaviour labels are not asserted to be declared API methods.

- [StateDiagram(upd).png](sources/SM-01-04-updated.png)
  SHA-256: `9b09f1bd104fdf87a397950fddc69aa4bbc8de75635794f4e05cd292d6718728`.

### SRC-14 - DEP-D deployment

Production/preview/CI/development topology, HTTPS, job scheduling, monitoring and encrypted backup. Operational commitments follow ADR-005/006.

- [DEP-D_deployment.png](sources/DEP-D-deployment.png)
  SHA-256: `5c270ad8ec54b9d41bc2cc1d4172929fa0e331893edf3e1fbb7ef13e4e581be6`.

### SRC-15 - DM-01 domain model

Lifecycle rules, independent resource properties, corrections, actor/target vocabulary and multiplicities.

- [T09-CampusBorrow/docs/design/domain-model/README.md](https://github.com/JuliaTrang/T09-CampusBorrow/blob/67109be0c52723c6279eb2a3236330627770f247/docs/design/domain-model/README.md)
  SHA-256: `1d4b1b837cd20582533ad6d896576890bb04def419cbc0172b9c7dd4484104a7`.

## Handoff and verification

When T18 is reviewed/merged, compare the merged content with the pinned revision. If unchanged, update its source/review record; if changed, recheck affected rows. Apply the same process to source-owner resolutions of R05/R06/R11/R12/R13. No application conformance or final team sign-off is asserted.

Preparation checks cover 93 unique FRs, preserved baseline values, all 22 CSV fields in the Markdown matrix, all 89 active state mappings, NFR/DR/BR counts, source fingerprints and repository links. The document extension/format checker is run before commit. [AI usage record](../../ai-usage/Phuc/t20-ai-log-PA3.md).
