# ADR-001: Technology stack

- **Status:** Accepted
- **Date:** 2026-10-18
- **Deciders:** Team T09 (TetraBo)

## Context

CampusBorrow is a role-based web app (Borrower, Resource Manager, Admin) with two state machines: equipment loans (F03–F04) and room bookings (F06–F07). The hard parts are:

- All permission checks must run on the server (F01).
- Approving a request must reserve the resource atomically, so that two managers cannot approve conflicting requests (F03, F07).
- A team of 4 has about three coding weeks (weeks 8–10) and must deliver unit tests, automated E2E tests and CI on pull requests (PA5).

Options considered for the application layer: **NestJS + React** and **Next.js (full-stack)**.

## Decision

| Layer | Choice |
|---|---|
| Front end | React + Vite (TypeScript), deployed as a static site on Vercel |
| Back end | NestJS (TypeScript), deployed on Vercel Functions |
| Database | PostgreSQL hosted on Supabase (database only; Supabase Auth is not used) |
| Data access | Prisma ORM; one hand-written SQL migration for the booking exclusion constraint |
| Auth | NestJS: bcrypt password hashes, JWT in an `httpOnly` cookie, `RolesGuard` for RBAC |
| CI | GitHub Actions on every pull request: lint, unit tests with coverage, build, E2E |
| Code quality | ESLint (typescript-eslint), Prettier, TypeScript `strict`, Husky + lint-staged pre-commit hook; CI fails on lint, format, type-check or coverage-threshold errors |
| CD | Vercel Git integration: preview deployment per pull request, production from `main` |
| DNS / CDN | Cloudflare, in front of the Vercel deployments for the custom domain |

We chose NestJS + React over Next.js because:

1. NestJS modules, controllers, services and dependency injection map directly onto the class, sequence and component diagrams required in PA3.
2. One global `RolesGuard` with a `@Roles()` decorator enforces RBAC on every route. Next.js would need a check in every route handler or server action.
3. A separate front end and back end lets members work in parallel against an API contract with fewer file conflicts.
4. NestJS ships with Jest and a testing module, which supports the PA5 unit-test and coverage criterion.

## Consequences

- **Learning cost:** every member must use TypeScript and learn NestJS decorators and DI. Plan about one week of ramp-up before week 8.
- **Serverless database connections:** Vercel Functions open many short-lived connections. The app connects through the Supabase pooler (transaction mode, port 6543, `pgbouncer=true`). Prisma migrations use the direct connection (`DIRECT_URL`, port 5432).
- **No in-memory state:** sessions cannot live in function memory, hence JWT cookies. The server checks the user's `active` flag on each request so that deactivation (F09) takes effect immediately.
- **Same origin:** the front-end Vercel project rewrites `/api/*` to the back-end project. Cookies stay first-party and CORS is not needed.
- **Conflict prevention lives in the database:** room bookings use `EXCLUDE USING gist` (`btree_gist` extension) over `(room_id, tstzrange(start_at, end_at))` for approved bookings. Equipment approval uses a transaction with `SELECT … FOR UPDATE`.
- **Code quality gates:** the same lint and format rules run locally (pre-commit) and in CI, so review time goes to logic rather than style. SonarQube Cloud and CodeQL are free only for public repositories; while the repository is private, ESLint is the static analysis tool.
- **Time:** all timestamps are stored as `timestamptz` and displayed in UTC+7.
- **Free-tier limits:** Supabase pauses free projects after a period of inactivity, and Vercel and Supabase quotas change over time. Check both before the week 11 demo.
