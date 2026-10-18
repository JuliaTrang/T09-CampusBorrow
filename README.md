# CampusBorrow

CampusBorrow is a web application for campus equipment loans and room bookings. Students and club representatives submit requests. Resource managers approve them, record hand-over and returns, and track overdue loans. Admins manage accounts, roles and resource assignments.

Team **T09 – TetraBo** · Introduction to Software Engineering, University of Science (VNU-HCM).

## Tech stack

| Layer | Technology |
|---|---|
| Front end | React + Vite (TypeScript) |
| Back end | NestJS (TypeScript), Prisma |
| Database | PostgreSQL on Supabase |
| Hosting | Vercel, Cloudflare DNS/CDN |
| Testing & CI | Jest, Supertest, Playwright, GitHub Actions |

Rationale: `docs/design/adr/ADR-001-tech-stack.md`.

## Repository structure

| Folder | Content |
|---|---|
| `src/client` | React front end |
| `src/server` | NestJS back end and Prisma schema |
| `docs/management` | Project plan; weekly status reports in `docs/management/weekly` |
| `docs/requirements` | Vision, SRS, use cases, mockups |
| `docs/design` | Architecture (C4), ADRs, UML, UI design |
| `docs/test` | Test plan, test cases, test reports |
| `docs/ai-usage` | AI usage logs |
| `pa/PA0` … `pa/PA5` | PA submissions (PDF + source) |

## Setup

> The application has not been scaffolded yet (WBS 5.1.1). Run commands will be added here with the scaffold.

1. Install Node.js 24 LTS and Git.
2. Clone the repository: `git clone https://github.com/JuliaTrang/T09-CampusBorrow.git`
3. Copy `.env.example` to `.env` and fill in the values. Never commit `.env`.

## Contributing

1. Create a branch from `main`: `<type>/<wbs-id>-<short-name>` (e.g. `feat/5.3.3-borrow-approval`).
2. Write commit messages in Conventional Commits style: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:`.
3. Open a pull request into `main` using the template, and link the board task.
4. Get at least one approval from another member. Merge with squash. Never push directly to `main`.
