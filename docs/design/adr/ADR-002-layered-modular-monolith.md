# ADR-002: Application structure – layered modular monolith

- **Status:** Accepted
- **Date:** 2026-11-17
- **Deciders:** Team T09 (TetraBo)
- **Based on:** the container and component tables agreed at the PA3 kickoff (2026-11-14)
- **Drivers:** NFR-03, NFR-09, team constraints (PA2 §3.5)
- **Affects:** CTN-02, CMP-01 – CMP-09, CD-01 … CD-0n

## Context

PA1 WBS 3.1.3 requires an application-structure decision. The structure must:

- keep approval, reservation, competing-request rejection and history in one transaction (FR-03-06, NFR-09);
- enforce authorisation on every endpoint (NFR-03);
- let one expiry rule serve both the endpoints and the background job (FR-03-15);
- map cleanly onto the PA3 diagrams and be built by four members within course capacity.

## Decision

- Build one NestJS application divided into nine modules: `AuthModule`, `AccountModule`, `CatalogModule`, `EquipmentLoanModule`, `RoomBookingModule`, `HistoryModule`, `CorrectionModule`, `SchedulerModule` and `CommonModule` (CMP-01 – CMP-09).
- In each module the path is Controller → Service → `PrismaService`. Controllers only receive requests and return responses; all business rules live in services.
- `SessionGuard` and `RolesGuard` are registered globally. A route is public only when it is explicitly marked (sign-in, registration, health).
- Cross-module calls go through exported services that accept the caller's transaction. In particular, every module writes history through `HistoryService`.
- REST/JSON under `/api`. Errors are mapped to 400 / 401 / 403 / 404 / 409 as agreed. A record that belongs to someone else, or a hidden resource, returns the same 403 so the response does not reveal that the record exists (UC-21 E2).
- The front end mirrors the modules in `features/` folders.

## Alternatives considered

- **Microservices per feature:** rejected. Approval would need a distributed transaction or a saga, and deployment and monitoring work would exceed the team's capacity and free-tier budget.
- **Logic in controllers (transaction script):** rejected. Rules would be duplicated between endpoints and `ExpiryJob` and could not be unit-tested in isolation.
- **Browser calls Supabase directly with row-level security:** rejected. Business rules would be written in SQL policies, and ADR-001 does not use Supabase Auth.

## Consequences

- **Positive:** one deployable unit; simple local and CI setup; each module maps 1:1 to a component, a class-diagram package and a sequence lifeline; services are unit-testable with a fixed `Clock`.
- **Negative:** the API process and the database are single failure domains (mitigated in ADR-006). Module boundaries hold only by convention and are checked in code review. Serverless cold starts add latency, which is measured against NFR-01 and NFR-02 in PA4 and PA5.
