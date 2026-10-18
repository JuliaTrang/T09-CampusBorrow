# Kiến trúc

## Tổng quan
```
Trình duyệt ──► Cloudflare (DNS/CDN) ──► Vercel: React (static)
                                          │  rewrite /api/*
                                          ▼
                                   Vercel Functions: NestJS API
                                          │  Prisma (pooler :6543)
                                          ▼
                                   Supabase: PostgreSQL
```
- `src/client`: React + Vite.
- `src/server`: NestJS. Mỗi nhóm tính năng là một module (auth, users, catalogue, loans, bookings, history).
- RBAC kiểm tra ở server bằng `RolesGuard`. Frontend chỉ ẩn/hiện giao diện, không dùng để bảo vệ quyền.

## Quyết định kỹ thuật
Chi tiết và lý do: `docs/design/adr/ADR-001-tech-stack.md`.

| Chủ đề | Chọn | Lý do |
|---|---|---|
| Front end | React + Vite (TS) | Nhẹ, tách rời backend để làm song song |
| Back end | NestJS (TS) | Module/DI khớp UML PA3; guard cho RBAC |
| Database | Supabase PostgreSQL (chỉ DB) | Transaction, exclusion constraint chống trùng lịch |
| ORM | Prisma + 1 migration SQL tay | Migration có version; constraint `EXCLUDE` viết tay |
| Auth | JWT trong cookie `httpOnly` + bcrypt | Serverless không giữ session trong bộ nhớ |
| Hosting | Vercel (2 project) + Cloudflare DNS/CDN | Preview deploy theo PR |
| CI | GitHub Actions trên pull request | Lint, unit test + coverage, build, E2E |
| Code quality | oxlint + Prettier + TS `strict`, Husky + lint-staged | Static analysis, cùng một style; CI chặn PR khi lỗi lint/type/coverage |
