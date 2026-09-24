# 🧪 Staging & database migration runbook

Staging runs the **same stack as production** (`app` + `postgres` + `redis`, plus a nightly
`pg_dump` job) so that everything verified here is what ships. Local development runs the same
Postgres and Redis, started from the same compose file with a loopback-only override — there is no
second database driver any more, so the schema and queries you develop against are the ones that
run in production.

| Environment | Database | Rate limiter | Notes |
|---|---|---|---|
| Local dev | `postgres://…@localhost:55432/driveit` | Redis (`localhost:56379`) | `docker compose -f docker-compose.yml -f docker-compose.local.yml up -d postgres redis`, then `npm run migrate && npm run dev` |
| Staging | `postgres://…@postgres:5432/driveit` | Redis | `docker compose up -d --build` |
| Production | same as staging | Redis | identical compose file, real domain + secrets |

Postgres is not optional. `lib/db.ts` rejects anything that is not a `postgres://` URL at boot, so
a misconfigured deploy fails immediately instead of quietly writing to a throwaway file.

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
  starts accepting traffic — from CI or a host checkout pointed at the same `DATABASE_URI`, because
  the app image is intentionally slim and has no toolchain. (`docker compose run --rm app` will not
  work for this: there is no `tsx` in that image.)

---

## 3. Moving data between instances (backup, restore, promotion)

The tooling is HTTP-based, so it works from any machine and doubles as a general backup/restore.
It is how you promote staging → production, and how you would move a database between hosts:

```bash
# 1. Export the source instance — ideally with the site in maintenance
SEED_BASE_URL=http://localhost:3000 npm run export:content -- --out=backup/pre-promotion

# 2. Start the target against an empty Postgres (schema created first)
DATABASE_URI=postgres://driveit:secret@localhost:55432/driveit npm run migrate
DATABASE_URI=postgres://driveit:secret@localhost:55432/driveit npm run dev -- -p 3001

# 3. Import. Documents keep their original ids, so relationships and
#    DRV-00001-style booking references stay valid, and the importer verifies
#    every stored id — it exits non-zero instead of silently re-keying.
SEED_BASE_URL=http://localhost:3001 npm run import:content -- --dir=backup/pre-promotion

# 4. REQUIRED: resync id sequences, or the next normal insert reuses an existing id
docker compose exec -T postgres psql -U driveit -d driveit < scripts/sql/fix-sequences.sql

# 5. Staff logins do not travel (password hashes are never exported). Create one:
ADMIN_PASSWORD='a-strong-password' npm run create:admin -- --email you@example.com
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

**One command does most of it.** `npm run smoke` writes a real booking, so it refuses to run
against anything that is not loopback unless you pass `--allow-remote`:

```bash
SEED_BASE_URL=http://localhost:3001 npm run smoke
SMOKE_BASE_URL=https://staging.example.com SEED_ADMIN_PASSWORD='…' npm run smoke -- --allow-remote
```

It asserts, in order: the CMS-backed pages and `/admin` answer 200; `/api/fleet` returns the real
fleet; `/api/bookings` and `/api/profile` are still private (403/401); a hold + confirm completes
with the price recomputed server-side; a replayed confirm is not double-charged; a forged hold
token is rejected; **three parallel holds on one car leave exactly one winner**; staff can log in
and completing a booking does not deadlock (and does not award loyalty twice); and the rate limiter
returns 429.

Run it from a checkout, not from inside the app image — that runtime image is deliberately slim
(no TypeScript toolchain, no scripts). Against a staging host, remember `--allow-remote`:

Manual spot-checks that the script cannot judge:

- `/admin` → edit a car price → reload `/cars` and confirm the change appears (ISR + cache tag).
- Place a booking and open the emailed PDF invoice; the reference must match `DRV-000NN`.
- `docker compose exec -T postgres psql -U driveit -d driveit -c "select last_value, is_called from cars_id_seq"`
  — `last_value` must be ≥ `max(id)` in `cars` (see `scripts/sql/fix-sequences.sql`).
- Query counts after an import: cars / services / testimonials / blogs / bookings / customers.

---

## 5. Promoting staging → production

1. Freeze writes (short maintenance notice) or accept a small gap.
2. `npm run export:content` against staging → `backup/prod-promotion`.
3. Provision production Postgres, deploy, `npm run migrate`.
4. `npm run import:content` against production, then `scripts/sql/fix-sequences.sql`.
5. Copy media.
6. `npm run smoke -- --allow-remote` against the real domain, plus the manual checks above.
7. Confirm `PAYLOAD_SCHEMA_PUSH` is unset, `REDIS_URL` is set, and `PAYLOAD_SECRET` /
   `AUTH_SECRET` are strong and unique to production.

**Rollback:** the previous database is untouched by every step above (the export is read-only).
Point `DATABASE_URI` back at it, redeploy the previous image, and only then investigate. Keep the
old dump and the previous database for at least two weeks.

---

## 6. Known limits (decide before scaling out)

- **Single app replica until media moves to S3/R2.** `public/media` lives on one volume; a second
  replica would serve 404s for uploaded images. `payload` has storage adapters for S3-compatible
  buckets — that is the prerequisite for horizontal scaling.
- **Redis is required once you run more than one replica**, otherwise each replica allows the full
  rate-limit quota. `lib/rate-limit.ts` warns loudly in production when `REDIS_URL` is missing.
- **Backups are nightly `pg_dump`s** (7 days kept). For point-in-time recovery, enable WAL
  archiving or use a managed Postgres.
- **Migrations are the only way schema changes ship.** `PAYLOAD_SCHEMA_PUSH=true` is for the first
  boot of an empty database; leaving it on lets a deploy reshape live tables without review.
