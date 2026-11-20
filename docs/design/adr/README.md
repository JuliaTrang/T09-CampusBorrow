# Architecture Decision Records

ADR-001 (technology stack) was accepted in PA1. PA3 adds ADR-002 – ADR-006; the same records appear in PA3 Software Design §3.6. **Proposed** means the decision waits for confirmation by the owners of open issue I-04 (Minh with Nhat Anh) before the PA3 design freeze; accepting it closes the stated subdecision of I-04.

| ADR                                                | Decision                                               | Status                                                    | Main drivers                                      | Design elements affected               |
| -------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| [ADR-001](ADR-001-tech-stack.md)                   | Technology stack                                       | Accepted (PA1); authentication details refined by ADR-003 | Team capacity, atomic approval, CI                | CTN-01 – CTN-03                        |
| [ADR-002](ADR-002-layered-modular-monolith.md)     | Layered modular monolith                               | Accepted                                                  | NFR-03, NFR-09, team constraints                  | CTN-02, CMP-01 – CMP-09, CD-01 … CD-0n |
| [ADR-003](ADR-003-jwt-cookie-auth.md)              | JWT cookie with pre-hashed bcrypt and token revocation | Accepted (closes I-05)                                    | FR-01-01 – FR-01-07, BR-07, BR-10, NFR-04, NFR-05 | CMP-01, SD-01, ERD-01                  |
| [ADR-004](ADR-004-database-concurrency-control.md) | Database-enforced concurrency control                  | Accepted                                                  | FR-03-03, FR-03-06, FR-07-03, BR-17, NFR-09       | CMP-03 – CMP-05, SD-02, SD-04, ERD-01  |
| [ADR-005](ADR-005-time-and-pickup-expiry.md)       | Time handling and pickup-expiry processing             | Proposed (I-04)                                           | BR-04, FR-03-13 – FR-03-15, DR-09                 | CMP-04, CMP-08, CMP-09, SD-03, SM-01   |
| [ADR-006](ADR-006-hosting-environments-backup.md)  | Hosting, environments and backup                       | Proposed (I-04)                                           | NFR-06, NFR-07, NFR-08, PA1 budget                | DEP-D, CTN-01 – CTN-03                 |

New records continue from the next free number; numbers are never reused. Names follow the PA3 kickoff glossary.
