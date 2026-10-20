# PA5 – AI Usage Log (Nguyen Tien Minh)

Uses the AI Usage Log table from the PA template. Each member keeps their own log in `docs/ai-usage/<Name>/ai-log-PA<x>.md`. Trang merges the rows into the PA5 report.

| # | Member | Tool | Task / purpose | How the output was verified and changed |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Scaffold the project (WBS 5.1.1): npm workspaces with a NestJS API and a React + Vite client, Prisma with the Supabase pooler adapter, `/api/health` endpoint, Prettier, oxlint, Husky + lint-staged pre-commit hook | Minh chose the stack (ADR-001) and kept the NestJS 12 and Vite CLI defaults (oxlint, Vitest). Ran format check, lint, typecheck, unit tests, the e2e test and both builds locally, and ran the server and called `/api/health`. Fixed issues found on the way: pinned Prisma 7.10.1 because `latest` pointed to an 8.0 release candidate, moved the generated client inside `src` to fix the TypeScript rootDir error, removed extra files created by `prisma init`, and removed a committed build cache file. |
| 2 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Write the GitHub Actions CI workflow (WBS 6.2.1): format check, lint, typecheck, unit tests, e2e test and build on every pull request | Checked that each step runs the same npm script as locally; the workflow passed on pull request #2. Coverage threshold, Playwright E2E and a Postgres service container are not added yet. |
