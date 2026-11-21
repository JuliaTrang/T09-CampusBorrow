# ADR-006: Hosting, environments and backup

- **Status:** Proposed (I-04). Waits for confirmation by the owners of I-04 (Minh with Nhat Anh) before the PA3 design freeze; accepting it closes the I-04 subdecision on hosting and backup assumptions.
- **Date:** 2026-11-17
- **Revised:** 2026-11-21 after the I-04 review in [#39](https://github.com/JuliaTrang/T09-CampusBorrow/issues/39) (points 6.1 – 6.6) and the PR #59 review
- **Deciders:** Team T09 (TetraBo)
- **Drivers:** NFR-06, NFR-07, NFR-08, PA1 budget
- **Affects:** DEP-D (PA3 §3.5), CTN-01 – CTN-03

## Context

- ADR-001 chose Vercel, Supabase and Cloudflare, and PA1 budgets about USD 7 per month for hosting.
- NFR-06 requires HTTPS for all production traffic. NFR-07 requires at least 99.0% availability during working hours 07:00 – 22:00 UTC+7, measured by an external monitor that calls a health endpoint every 5 minutes. NFR-08 requires daily backups, RTO ≤ 2 h and RPO ≤ 24 h, and its note assumes that the Supabase plan allows backups.
- The Supabase Free plan pauses a project after 7 days without activity, allows two active projects and has no automatic backups. Vercel Cron on the Hobby plan runs at most once a day.
- The repository is public.

## Decision

- **Vercel projects.** Two projects: `web` (static React build on the CDN) and `api` (NestJS on Vercel Functions in the Singapore region). The `web` project rewrites `/api/*` to `api`, so the JWT cookie stays first-party (ADR-003).
- **Environments.** Production is deployed from `main` and a preview from every pull request.
- **Database.** Production uses a Supabase PostgreSQL project in Singapore. Previews use a separate development project, and CI uses a PostgreSQL service container, so tests never touch production data.
- **Connections and migrations.** At runtime the API connects through the Supabase pooler in transaction mode. Migrations run with `prisma migrate deploy` over the direct connection in the release workflow.
- **Domain and secrets.** Cloudflare DNS serves the custom domain, and HTTP is redirected to HTTPS. Secrets are kept only in Vercel and GitHub environment settings.
- **Backup (NFR-08).** A scheduled GitHub Actions workflow runs daily at 02:00 UTC+7. It pipes `pg_dump` of production straight into `age`, encrypted to the team's backup public key, so no unencrypted dump is written to disk or uploaded. The encrypted file is uploaded as a workflow artifact with a retention of 7 days, so RPO ≤ 24 h. Because the repository is public, any signed-in GitHub user can download its artifacts; encryption before upload is therefore mandatory.
- **Only backup on the Free plan.** The Free plan has no automatic backup, so this daily `pg_dump` is the only backup. Plan backups become a second copy only if the project moves to a paid plan. The `pg_dump` client must have the same major version as the Supabase PostgreSQL server or a newer one; the workflow installs that version explicitly.
- **Keys and restore.** The `age` public key is committed in the repository; it is not a secret. The private key is kept outside the repository, in the personal password managers of two people (Trang and Minh). Only they can decrypt a dump and run a restore. The production connection string used by the workflow is a secret of the GitHub `production` environment. A restore drill into a new database before the PA5 demo measures RTO and compares record counts.
- **Missed backups.** A failed run sends the GitHub failure notification to the workflow owner. Each weekly report records the date of the last successful backup run, so a run that never started (for example a disabled workflow) is noticed within a week. RPO ≤ 24 h is not met during such a gap; the team accepts this as a known risk of free scheduling. A GitHub Actions schedule is acceptable here although ADR-005 rejects it for expiry: a daily backup tolerates a delay of hours, the expiry target of 5 minutes does not.
- **Monitoring (NFR-07).** UptimeRobot (free plan) runs an HTTP monitor on `GET /api/health`, which makes a database round trip, every 5 minutes and sends e-mail alerts to the team. NFR-07 uptime = successful checks ÷ all checks between 07:00 and 22:00 UTC+7, taken from the monitor logs, which are exported before PA4 and before the PA5 demo. The same checks keep the Supabase project from pausing after 7 days without activity.

## Alternatives considered

- **One container host running a long-lived NestJS process:** would allow in-process cron, but free tiers sleep or are limited, and the team would manage the server.
- **Supabase Edge Functions as the back end:** Deno runtime, not NestJS (conflicts with ADR-001 and ADR-002).
- **Self-hosted PostgreSQL:** the team would carry the backup and patching work.
- **Unencrypted dump in a workflow artifact:** anyone signed in to GitHub could download production data from the public repository.

## Consequences

- **Positive:** no server administration, a preview for every pull request, and hosting within the PA1 budget.
- **Negative:** function cold starts are measured in PA4 (NFR-01); the 5-minute health check keeps the database active but is not relied on to keep functions warm. Free-tier quotas and plan limits must be rechecked before the week-11 demo. A late scheduled run still meets RPO ≤ 24 h.
- **No third database project:** production and preview use both active projects allowed on the Supabase Free plan, so there is no room for a third project. CI keeps using the PostgreSQL service container.
- **Scheduled workflows can be disabled:** GitHub may disable scheduled workflows in a public repository after a long period without activity. The team checks that the backup workflow is still enabled before the week-11 demo and before PA5.
- **Key loss:** if both holders lose the private key, existing dumps cannot be restored. A new key pair is then created, its public key committed, and the next run uses it.
- **Follow-up:** DEP-D (PA3 §3.5) and the PA4 test environment follow this record. The NFR-08 note in PA2 v2 should be updated to state that on the Supabase Free plan the daily `pg_dump` is the only backup.
