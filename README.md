# CampusBorrow

CampusBorrow is a web application for campus equipment loans and room bookings. Students and club representatives submit requests. Resource managers approve them, record hand-over and returns, and track overdue loans. Admins manage accounts, roles and resource assignments.

Team **T09 – TetraBo** · Introduction to Software Engineering, University of Science (VNU-HCM).

## Tech stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Front end    | React + Vite (TypeScript)                   |
| Back end     | NestJS (TypeScript), Prisma                 |
| Database     | PostgreSQL on Supabase                      |
| Hosting      | Vercel, Cloudflare DNS/CDN                  |
| Testing & CI | Jest, Supertest, Playwright, GitHub Actions |

Rationale: `docs/design/adr/ADR-001-tech-stack.md`.

## Repository structure

| Folder                   | Content                                                |
| ------------------------ | ------------------------------------------------------ |
| `src/client`             | React front end                                        |
| `src/server`             | NestJS back end and Prisma schema                      |
| `docs/management`        | Project plans, schedules and management evidence       |
| `docs/management/weekly` | Weekly status reports                                  |
| `docs/requirements`      | Vision, SRS, use cases, mockups                        |
| `docs/design`            | Architecture (C4), UML, UI design and diagram sources  |
| `docs/design/adr`        | Architecture decision records                          |
| `docs/test`              | Test plan, test cases, test reports                    |
| `docs/WBS`               | Work breakdown structure and its document/HTML exports |
| `docs/ai-usage`          | AI usage logs grouped by member                        |
| `pa/PA0` … `pa/PA5`      | PA submissions (PDF + source)                          |
| `.github/workflows`      | GitHub Actions CI workflows                            |
| `scripts`                | Repository checks and their automated tests            |

## Document checks

The **Document checks** workflow runs on pull requests and pushes to `main`. It checks allowed file extensions for all existing Git-tracked files in `docs/` and `pa/`. File names remain a team convention and are not checked. Extensions are case-insensitive; `.gitkeep` placeholders are permitted.

| Folder (including subfolders) | Allowed extensions                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| `docs/design/adr`             | `.md`                                                                                   |
| `docs/ai-usage`               | `.md`                                                                                   |
| `docs/management/weekly`      | `.md`, `.docx`                                                                          |
| `docs/management`             | `.md`, `.docx`, `.pdf`, `.xlsx`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.svg`                |
| `docs/requirements`           | `.md`, `.docx`, `.pdf`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.drawio`                      |
| `docs/design`                 | `.md`, `.docx`, `.pdf`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.mmd`, `.drawio`              |
| `docs/test`                   | `.md`, `.docx`, `.pdf`, `.xlsx`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.svg`                |
| `docs/WBS`                    | `.md`, `.docx`, `.pdf`, `.xlsx`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.html`       |
| `pa`                          | `.md`, `.docx`, `.pdf`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.tex`, `.bib`, `.sty`, `.cls` |

The most specific folder rule applies: for example, ADRs only allow Markdown even though `docs/design` also accepts Word, PDF and images. A new top-level document folder needs an extension rule in `scripts/check-docs.mjs` and an entry in this table.

Formatting uses Prettier **3.9.10** with `.github/docs-prettier.json`. It checks added or modified tracked Markdown in `README.md`, `docs/` and `pa/`: against the PR base commit for pull requests, or the previous commit for pushes to `main`. This preserves unchanged historical reports and submitted baselines. If no base is supplied, or the base is all zeros, it checks all tracked Markdown in that scope. Word/PDF layout, exported HTML and TeX formatting remain subject to human review.

CI installs the exact formatter version into the runner's temporary directory with package scripts disabled, independently of the application scaffold. To check locally with Node.js 24, Git and Prettier 3.9.10 available in `node_modules`:

```sh
node --test scripts/check-docs.test.mjs
node scripts/check-docs.mjs --base main
```

Stage new documents before checking locally so Git can include them. `PRETTIER_CLI` may point to a Prettier CLI installed elsewhere. To format a changed Markdown file before retrying, use:

```sh
node node_modules/prettier/bin/prettier.cjs --config .github/docs-prettier.json --no-editorconfig --write path/to/document.md
```

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
