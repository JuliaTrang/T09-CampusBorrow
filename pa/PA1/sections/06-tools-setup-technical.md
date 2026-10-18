# 6 Tools & Collaboration Setup — technical part

> PA1 draft. Owner: Nguyen Tien Minh. Reviewer: Phan Nhat Anh.
> The task board, Discord, TA access, meeting schedule and the weekly report deadline belong to Nguyen Hoang My Trang and are merged into this section by her.

## Git repository

| Item | Value |
| :---- | :---- |
| Host | GitHub (private): https://github.com/JuliaTrang/T09-CampusBorrow |
| Default branch | `main` (protected, see below) |
| Access | All 4 members have write access. The instructor and TA are added as collaborators by the repository owner. |
| Secrets | `.env` is ignored by `.gitignore`. `.env.example` lists the required variables. Real values are stored only in Vercel and GitHub Actions secrets. |

## Repository structure

| Folder | Content |
| :---- | :---- |
| /src/client | React + Vite front end (created when the project is scaffolded) |
| /src/server | NestJS back end and Prisma schema (created when the project is scaffolded) |
| /docs/management | Project plan and PA1 assignment; weekly status reports in /docs/management/weekly (`W<week>-status.md`) |
| /docs/requirements | Vision, SRS, use cases, mockups |
| /docs/design | Architecture (C4), ADRs in /docs/design/adr, UML models, UI design |
| /docs/test | Test plan, test cases, test reports |
| /docs/ai-usage | AI usage logs: one folder per member (`Trang`, `Phuc`, `PAnh`, `Minh`), one file per PA (`ai-log-PA<x>.md`) |
| /pa/PA0 … /pa/PA5 | One sub-folder per PA submission (PDF + source files) |
| /.github | Pull-request template; CI workflows (added with the scaffold) |

## Branching and pull-request process

1. Each task on the board gets its own branch from the latest `main`. Branch names follow `<type>/<wbs-id>-<short-name>`, e.g. `feat/5.3.3-borrow-approval` or `docs/pa1-section-3`.
2. Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:`.
3. When the work is ready, open a pull request into `main` using `.github/pull_request_template.md`, and link the board task.
4. At least **one approval from another member** is required. Following PA0 §3.4, the backup of the role reviews the primary's work, and nobody approves their own pull request.
5. After CI is added (WBS 5.1.2), all checks must pass before merge.
6. Merge with **squash merge**, then delete the branch. Nobody pushes directly to `main`, and nobody force-pushes.

## Protection rules for `main`

These rules are applied by the repository owner (Nguyen Hoang My Trang). Other members do not have admin rights.

| Setting (Settings → Branches → Add rule `main`, or Rules → Rulesets) | Value |
| :---- | :---- |
| Require a pull request before merging | On |
| Required approvals | 1 |
| Dismiss stale approvals when new commits are pushed | On |
| Require status checks to pass | On, after the CI workflow exists |
| Block force pushes | On |
| Restrict deletions | On |
| Do not allow bypassing the above settings (include administrators) | On |

> **Note:** GitHub enforces branch protection on **private** repositories only for owners on GitHub Pro, Team or Enterprise. The owner can activate GitHub Pro for free with the GitHub Student Developer Pack, or the team can make the repository public.

## Setup evidence

Attach these screenshots or links to the final PA1 document.

| # | Evidence | Status |
| :---- | :---- | :---- |
| 1 | Repository tree showing the structure above | Ready after the setup PR is merged |
| 2 | Branch protection or ruleset settings for `main` | Waiting for the owner to apply the rules |
| 3 | Collaborators page listing the instructor and TA | Waiting for the owner |
| 4 | A merged pull request with one approving review | First setup PR |
| 5 | `.gitignore` and `.env.example` in the repository | Ready after the setup PR is merged |
