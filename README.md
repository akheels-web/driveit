# 🚗 DriveIt — Luxury Concierge & Fleet Management

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.90-white?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

A luxury car-rental and concierge site: Next.js App Router front end, Payload CMS 3 as the
admin/API back end, SQLite (libSQL) for storage — all in one deployable Next.js app.

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
| Database | Postgres (staging/production) or SQLite (local dev) — chosen from `DATABASE_URI` |
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

Then fill in at least `PAYLOAD_SECRET` and `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Every variable is documented in `.env.local.example`. The only required ones are the two secrets;
`AUTH_GOOGLE_*`, `RESEND_API_KEY`, `WHATSAPP_*`, `TELEGRAM_*` and `WACRM_*` enable optional features
and warn (rather than crash) when absent.

### 3. Run

```bash
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

On first boot in development Payload creates the SQLite schema (`driveit.db`) from the collections.
The site works immediately: while a collection is still empty the pages fall back to the bootstrap
content in `lib/*-seed.ts`.

### 4. Seed content into the CMS (recommended)

With the app running:

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' npm run seed
```

This creates the first staff account and moves the bootstrap fleet (28 cars), services, reviews,
journal entries, homepage counters and FAQs into Payload, where they can be edited. It is
idempotent, and prints a generated password when `SEED_ADMIN_PASSWORD` is not supplied.

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
| `npm run export:content` | Dump every collection + global to JSON (backups, migrations) |
| `npm run import:content` | Restore such a dump, preserving ids |
| `npm run migrate` / `migrate:create` | Apply / generate Payload migrations |
| `npm run generate:types` | Regenerate `payload-types.ts` from the collections |

---

## 🗄 Database

The driver is inferred from `DATABASE_URI` (see `lib/db.ts`) — no code changes to switch:

- `file:./driveit.db` — SQLite. Local development, zero setup, schema pushed automatically.
- `postgres://…` — Postgres. **Required for staging and production**, because SQLite has a single
  writer: replicas would fight over one file, every deploy restarts the only writer, and shared-file
  locking over network storage is unsafe.

Both adapters run with numeric ids, so the two databases are interchangeable for data tooling.

- Never commit `driveit.db` (it is git-ignored) — it contains staff accounts and customer data.
- First deploy of an empty database: `PAYLOAD_SCHEMA_PUSH=true` once, then migrations only:
  `npm run migrate:create` (commit the SQL) and `npm run migrate` as a deploy step.
- Moving an existing database, verification checklist, rollback and the production promotion
  steps are all in **[STAGING.md](./STAGING.md)**.

---

## 🐳 Docker / VPS deployment

`docker compose` brings up the whole staging stack — app, Postgres, Redis and a nightly `pg_dump`
job — with the app bound to `127.0.0.1:3000` for nginx to reverse-proxy.

```bash
docker compose up -d --build
```

Persist `/app/public/media` (uploads) and the `driveit-pg` volume (database).

- Staging setup, data migration, verification checklist and promotion/rollback: **[STAGING.md](./STAGING.md)**
- Server hardening, HTTPS, monitoring, rollout: [`deployment_guide.md`](./deployment_guide.md)
- Resource sizing: [`vps_sizing_report.md`](./vps_sizing_report.md)

---

## 📝 License

MIT.
