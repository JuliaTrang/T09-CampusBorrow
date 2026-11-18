# ADR-006: Hosting, environments and backup

- **Status:** Proposed (I-04). Waits for confirmation by the owners of I-04 (Minh with Nhat Anh) before the PA3 design freeze; accepting it closes the I-04 subdecision on hosting and backup assumptions.
- **Date:** 2026-11-17
- **Deciders:** Team T09 (TetraBo)
- **Drivers:** NFR-06, NFR-07, NFR-08, PA1 budget
- **Affects:** DEP-D (PA3 §3.5), CTN-01 – CTN-03

## Context

- ADR-001 chose Vercel, Supabase and Cloudflare, and PA1 budgets about USD 7 per month for hosting.
- NFR-06 requires HTTPS for all production traffic. NFR-07 requires at least 99.0% availability during working hours. NFR-08 requires daily backups, RTO ≤ 2 h and RPO ≤ 24 h, and its note says the Supabase plan must allow backups.
- Free Supabase projects pause after a period of inactivity.

## Decision

- **Vercel projects.** Two projects: `web` (static React build on the CDN) and `api` (NestJS on Vercel Functions in the Singapore region). The `web` project rewrites `/api/*` to `api`, so the JWT cookie stays first-party (ADR-003).
- **Environments.** Production is deployed from `main` and a preview from every pull request.
- **Database.** Production uses a Supabase PostgreSQL project in Singapore. Previews use a separate development project, and CI uses a PostgreSQL service container, so tests never touch production data.
- **Connections and migrations.** At runtime the API connects through the Supabase pooler in transaction mode. Migrations run with `prisma migrate deploy` over the direct connection in the release workflow.
- **Domain and secrets.** Cloudflare DNS serves the custom domain, and HTTP is redirected to HTTPS. Secrets are kept only in Vercel and GitHub environment settings.
- **Backup (NFR-08).** A scheduled GitHub Actions workflow runs `pg_dump` of production daily at 02:00 UTC+7 and keeps the encrypted dump for 7 days in private storage, so RPO ≤ 24 h. A restore drill into a new database before the PA5 demo measures RTO and compares record counts. The Supabase plan's own backups, where available, are a second copy only.
- **Monitoring (NFR-07).** An external uptime monitor calls `GET /api/health` (which runs a database round trip) every 5 minutes. This also keeps the free database project active.

## Alternatives considered

- **One container host running a long-lived NestJS process:** would allow in-process cron, but free tiers sleep or are limited, and the team would manage the server.
- **Supabase Edge Functions as the back end:** Deno runtime, not NestJS (conflicts with ADR-001 and ADR-002).
- **Self-hosted PostgreSQL:** the team would carry the backup and patching work.

## Consequences

- **Positive:** no server administration, a preview for every pull request, and hosting within the PA1 budget.
- **Negative:** function cold starts are measured in the NFR-01 test, and the uptime monitor keeps functions warm. Free-tier quotas and plan limits must be rechecked before the week-11 demo. A late scheduled workflow still meets RPO ≤ 24 h.
- **Follow-up:** DEP-D (PA3 §3.5) and the PA4 test environment follow this record.
