# 🧪 Staging & database migration runbook

Staging runs the **same stack as production** (`app` + `postgres` + `redis`, plus a nightly
`pg_dump` job) so that everything verified here is what ships. Local development keeps using
SQLite for zero-setup work; the driver is chosen from `DATABASE_URI`, so the two never conflict.

| Environment | Database | Rate limiter | Notes |
|---|---|---|---|
| Local dev | `file:./driveit.db` (SQLite) | in-process | `npm run dev`, schema pushed automatically |
| Staging | `postgres://…@postgres:5432/driveit` | Redis | `docker compose up -d --build` |
| Production | same as staging | Redis | identical compose file, real domain + secrets |

---

## 1. Run the stack

```bash
cp .env.local.example .env      # fill in PAYLOAD_SECRET, AUTH_SECRET, POSTGRES_PASSWORD…
docker compose up -d --build
docker compose ps               # app, postgres, redis should all be healthy
```

The app binds to `127.0.0.1:3000` on purpose — put nginx in front (see
[`deployment_guide.md`](./deployment_guide.md)) and never expose port 3000 directly. The rate
limiter trusts forwarding headers, which is only safe when something trustworthy sets them.

Create the first admin + starter content:

```bash
docker compose exec app node -e "1" # sanity check the container is alive
SEED_BASE_URL=http://localhost:3000 \
SEED_ADMIN_EMAIL=you@example.com \
SEED_ADMIN_PASSWORD='a-strong-password' \
npm run seed
```

`npm run seed` talks to the app over HTTP, so it can run from your laptop against staging too.

---

## 2. Schema: push now, migrations forever after

- **First deploy of an empty database** — set `PAYLOAD_SCHEMA_PUSH=true`. Payload creates the
  tables on boot. This is the only time that is acceptable.
- **Then** remove the flag and use migrations, so a release can never reshape live tables silently:

  ```bash
  npm run migrate:create        # generates SQL in migrations/ from the collections
  npm run migrate               # applies pending migrations
  ```

  Commit the generated files. Run `npm run migrate` as a deploy step *before* the new container
  starts accepting traffic.

---

## 3. Moving data from SQLite to Postgres

The tooling is HTTP-based, so it works from any machine and doubles as a general backup/restore:

```bash
# 1. Export the old (SQLite) instance — do this first, ideally with the site in maintenance
SEED_BASE_URL=http://localhost:3000 npm run export:content -- --out=backup/pre-cutover

# 2. Start the new instance against Postgres (fresh database, schema pushed or migrated)
DATABASE_URI=postgres://driveit:secret@localhost:5432/driveit npm run dev -- -p 3001
#    …or just deploy staging, which does this for you.

# 3. Import. Documents keep their original ids, so relationships and
#    DRV-00001-style booking references stay valid.
SEED_BASE_URL=http://localhost:3001 npm run import:content -- --dir=backup/pre-cutover

# 4. REQUIRED: resync id sequences, or the next normal insert reuses an existing id
docker compose exec -T postgres psql -U driveit -d driveit < scripts/sql/fix-sequences.sql
```

Other useful invocations:

```bash
npm run import:content -- --dir=backup/pre-cutover --dry-run   # report without writing
npm run import:content -- --dir=backup/pre-cutover --update    # overwrite existing docs
```

**Important:** the export does not contain uploaded files. Copy `public/media` (or the
`driveit-media` volume) across as well:

```bash
docker compose cp driveit-app:/app/public/media ./media-backup
docker compose cp ./media-backup driveit-app:/app/public/media
```

Staff passwords are never exported (Payload does not return hashes), so imported staff accounts
must use **forgot password** once and set a new one.

---

## 4. Verification checklist

Run these after any cutover or staging deploy. Everything here has been exercised at least once
on a real instance:

```bash
# content arrived, with ids intact
curl -s http://localhost:3001/api/fleet | head -c 120

# the public site renders from the CMS, not from the seed fallback
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/blog
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/admin

# private data is NOT public
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/api/bookings   # expect 403
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/api/profile    # expect 401

# a whole booking, including server-side pricing and the hold token
curl -s -X POST http://localhost:3001/api/checkout/init -H 'Content-Type: application/json' \
  -d '{"carSlug":"volvo-xc60","startDate":"2026-12-01","endDate":"2026-12-03","customerName":"Verify","customerEmail":"verify@example.com","customerPhone":"+919999999999"}'
# → totalPrice must equal days × the CMS price, and the response must contain holdToken

# coupons are validated from the CMS, not hardcoded
curl -s -X POST http://localhost:3001/api/coupons/validate -H 'Content-Type: application/json' \
  -d '{"code":"FIRST10","email":"verify@example.com","subtotal":18000}'   # expect valid:false
```

Then, by hand: open `/admin`, edit a car price, reload `/cars` and confirm the change appears;
place one full booking and confirm the invoice PDF renders and the reference matches.

---

## 5. Promoting staging → production

1. Freeze writes (short maintenance notice) or accept a small gap.
2. `npm run export:content` against staging → `backup/prod-cutover`.
3. Provision production Postgres, deploy, `npm run migrate`.
4. `npm run import:content` against production, then `scripts/sql/fix-sequences.sql`.
5. Copy media.
6. Run the checklist above against the real domain, on both customer and admin flows.
7. Remove `PAYLOAD_SCHEMA_PUSH`, confirm `REDIS_URL` is set, and confirm `PAYLOAD_SECRET` /
   `AUTH_SECRET` are strong and unique to production.

**Rollback:** the old database is untouched by every step above. Point `DATABASE_URI` back at it,
redeploy the previous image, and only then investigate. Keep the old data for at least two weeks.

---

## 6. Known limits (decide before scaling out)

- **Single app replica until media moves to S3/R2.** `public/media` lives on one volume; a second
  replica would serve 404s for uploaded images. `payload` has storage adapters for S3-compatible
  buckets — that is the prerequisite for horizontal scaling.
- **Redis is required once you run more than one replica**, otherwise each replica allows the full
  rate-limit quota. `lib/rate-limit.ts` warns loudly in production when `REDIS_URL` is missing.
- **Backups are nightly `pg_dump`s** (7 days kept). For point-in-time recovery, enable WAL
  archiving or use a managed Postgres.
- **SQLite stays supported** as a local/fallback driver, but not for staging or production.
