# 🚗 DriveIt — Luxury Concierge & Fleet Management

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.90-white?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Postgres](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

A luxury car-rental and concierge site: Next.js App Router front end, Payload CMS 3 as the
admin/API back end, Postgres for storage, Redis for shared rate limiting — all in one deployable
Next.js app.

Everything a marketer sees on the website (fleet, services, reviews, journal articles, counters,
FAQs, branding and contact details) is editable in `/admin`. Nothing is hardcoded into the pages.

---

## ✨ Features

**Customer experience**

- Statically rendered marketing pages (ISR, 5-minute revalidation) with cache invalidation on every CMS save.
- Fleet browsing (`/cars`, `/cars/[slug]`) fed by `/api/fleet`, a cached read-only feed.
- Server-priced checkout: the browser sends dates and a car slug, the server recomputes every
  rupee from the CMS price, validates coupons, and issues a 10-minute hold so two people cannot
  hold the same car.
- UPI QR payment (generated locally) plus a booking reference (`DRV-00001`) and a branded PDF
  invoice emailed on confirmation.
- Customer accounts: Google or email sign-in, saved addresses, wishlist, loyalty tier, booking
  history and printable invoices under `/dashboard`.

**CMS / operations (`/admin`)**

- Collections: Cars, Services, Testimonials, Journal posts, Bookings, Customers, Wishlists, Coupons, Media, Staff.
- Global: Site Settings (branding, contact details, counters, FAQs).
- Role-based access — `admin` manages everything, `editor` manages content but not staff, coupons or site settings.
- Every public collection is read-only for anonymous visitors; writes require a signed-in staff account.

**Security**

- No secret ever falls back to a hardcoded value: `PAYLOAD_SECRET` / `AUTH_SECRET` must be set or the app refuses to boot.
- Rate limiting on checkout, confirm, coupon validation, contact and wishlist traffic: per-IP plus a
  per-scope ceiling, on a **Redis** store when `REDIS_URL` is set (required for more than one
  replica) and an in-process store otherwise.
- Confirmations require the random hold token issued to that browser — bookings cannot be
  confirmed (or email-bombed) by guessing a booking id.
- Password-hashed staff/customer accounts, login throttling, HSTS/`X-Frame-Options`/nosniff/referrer headers.
- Telegram and WhatsApp credentials are server-only; nothing sensitive is prefixed `NEXT_PUBLIC_`.

---

## 🛠 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| CMS / API | Payload CMS 3.90 |
| Database | **Postgres 16** (only supported driver — see `lib/db.ts`) |
| Auth | Auth.js (NextAuth v5) for customers, Payload auth for staff |
| Styling | Tailwind CSS 4, Framer Motion (`motion`) |
| Email | Resend (`@payloadcms/email-resend`) |
| PDF | `@react-pdf/renderer` |
| Media | `sharp` for resizing/AVIF-WebP on upload |

---

## 🚀 Local setup

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.local.example .env.local
```

Then fill in at least `DATABASE_URI`, `PAYLOAD_SECRET` and `AUTH_SECRET`:

```bash
# Postgres + Redis for local development (loopback-only ports, 55432 / 56379)
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d postgres redis

# generate each secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Every variable is documented in `.env.local.example`. The only required ones are the database URL
and the two secrets; `AUTH_GOOGLE_*`, `RESEND_API_KEY`, `WHATSAPP_*`, `TELEGRAM_*` and `WACRM_*`
enable optional features and warn (rather than crash) when absent.

### 3. Migrate and run

```bash
npm run migrate      # apply migrations/ (never rely on schema auto-push)
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The site works immediately after migrating: while a collection is still empty the pages fall back to
the bootstrap content in `lib/*-seed.ts`. Without a reachable Postgres the app refuses to boot —
there is deliberately no local-file fallback, so what you develop against is what you deploy.

### 4. Seed content into the CMS (recommended)

With the app running:

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' npm run seed
```

This creates the first staff account and moves the bootstrap fleet (28 cars), services, reviews,
journal entries, homepage counters and FAQs into Payload, where they can be edited. It is
idempotent, and prints a generated password when `SEED_ADMIN_PASSWORD` is not supplied.

If you only need an admin account (the database already has content), use
`ADMIN_PASSWORD='…' npm run create:admin -- --email you@example.com` instead — it works offline via
Payload's local API and can also reset a forgotten password with `--reset-password`.

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build (type-checks; type errors fail the build) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, 0 errors enforced) |
| `npm run seed` | Seed a running instance through the Payload REST API |
| `npm run create:admin` | Create (or password-reset) a staff account via the local API |
| `npm run smoke` | End-to-end verification: pages, booking, concurrency, rate limits. Writes a real booking, so it only runs against localhost unless you pass `--allow-remote` |
| `npm run export:content` | Dump every collection + global to JSON (backups, migrations) |
| `npm run import:content` | Restore such a dump, preserving ids |
| `npm run migrate` / `migrate:create` | Apply / generate Payload migrations |
| `npm run migrate:status` / `migrate:down` | Inspect / roll back applied migrations |
| `npm run generate:types` | Regenerate `payload-types.ts` from the collections |

---

## 🗄 Database

**Postgres is the only supported database**, and `lib/db.ts` enforces it: `DATABASE_URI` must be a
`postgres://` URL or the app refuses to boot. There is no second driver to keep in sync, so the
schema you develop against is the schema you deploy.

```bash
DATABASE_URI=postgres://driveit:<password>@localhost:55432/driveit
```

- Schema changes come from committed migrations (`migrations/`), applied with `npm run migrate`.
  `PAYLOAD_SCHEMA_PUSH=true` exists for the very first boot of an empty database and should then be
  turned off permanently (`payload.config.ts` logs which mode it is in).
- Single-writer limits, data moves, verification checklist, promotion and rollback are all in
  **[STAGING.md](./STAGING.md)**.
- Never commit a database dump or a `.env*` file — both are git-ignored, and both contain customer
data or credentials.

## 🧪 Verifying a deployment

```bash
npm run smoke                    # against http://localhost:3000
SMOKE_BASE_URL=https://staging.example.com npm run smoke
```

`scripts/smoke.ts` checks the things that actually break: the CMS-backed pages render, private
collections stay private (403/401), a full booking works with server-side pricing, a replayed or
forged confirm is rejected, concurrent holds on one car leave exactly one winner, staff can
complete a booking without deadlocking, and the rate limiter returns 429. Staff checks run when
`SEED_ADMIN_PASSWORD` is set — put it in `.env.smoke` (git-ignored) or pass it inline.

---

## 🐳 Docker / VPS deployment

`docker compose` brings up the whole staging stack — app, Postgres, Redis and a nightly `pg_dump`
job — with the app bound to `127.0.0.1:3000` for nginx to reverse-proxy.

```bash
docker compose up -d --build
```

Persist `/app/public/media` (uploads) and the `driveit-pg` volume (database).

- Staging setup, data movement, verification checklist and promotion/rollback: **[STAGING.md](./STAGING.md)**
- Server hardening, HTTPS, monitoring, rollout: [`deployment_guide.md`](./deployment_guide.md)

---

## 📝 License

MIT.
