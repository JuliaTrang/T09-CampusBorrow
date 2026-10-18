# PA1 – AI Usage Log (Nguyen Tien Minh)

Uses the AI Usage Log table from PA1 section 7. Required in every PA under the course GenAI policy. Each member keeps their own log in `docs/ai-usage/<Name>/ai-log-PA<x>.md`. Trang merges the rows into PA1 section 7.

| # | Member | Tool | Task / purpose | How the output was verified and changed |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Restructure the repository to match the PA1 §6 structure (`pa/PA1`–`pa/PA5`, `.gitkeep` placeholders); write `.gitignore` and `.env.example` | Checked the folder list against the template's repository-structure table. Tested the ignore rules with `git check-ignore` (`.env`, `node_modules/`, Word lock files). Moved personal files out of the shared `.gitignore` into the local `.git/info/exclude`. |
| 2 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Compare NestJS + React with Next.js; draft ADR-001 (technology stack) and `docs/design/architecture.md` | Minh made the final choices: NestJS + React, Supabase as database only, Vercel, GitHub Actions, and Cloudflare only for DNS/CDN. The AI options for auth and Cloudflare were narrowed to these. *Pending: team review of ADR-001.* |
| 3 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Write a script to convert the `.docx` files (PA0, PA1 assignment, course templates) to Markdown for the Obsidian vault | Compared the headings and tables in the output against the original documents. The original `.docx` files are kept as the official sources. |
| 4 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Draft PA1 §3 Proposed Solution: C4 System Context, technology stack table, hardware and operating environment | *Pending: Minh to check every statement against PA0 and ADR-001; review by Phan Nhat Anh (testability, environment).* |
| 5 | Nguyen Tien Minh | Claude Code (Claude Opus 5.5) | Draft the technical part of PA1 §6 (structure, PR process, `main` protection rules), README and the PR template | *Pending: review by Phan Nhat Anh; the owner applies the branch protection; screenshots to be collected as evidence.* |
