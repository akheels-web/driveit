import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'

/**
 * Database: Postgres, and only Postgres.
 *
 * There is deliberately no SQLite path anymore. A second driver means a second
 * schema dialect to keep in sync, and the two inevitably drift — the kind of
 * bug that only shows up on the day you cut over. Postgres is required so that
 * the schema you develop against is the schema you deploy.
 *
 * Locally, run Postgres in Docker:
 *   docker compose -f docker-compose.yml -f docker-compose.local.yml up -d postgres redis
 *
 * `DATABASE_URI` must be a postgres:// URL. `lib/env.ts`-style fail-fast: the
 * app refuses to boot rather than silently creating a throwaway database.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** `migrations` next to this config — committed SQL, applied by `npm run migrate`. */
const migrationsDir = path.resolve(dirname, '..', 'migrations')

export class DatabaseConfigError extends Error {}

/** True for the URIs Payload's Postgres adapter accepts. */
export function isPostgresUri(uri: string): boolean {
  return /^postgres(ql)?:\/\//i.test(uri.trim())
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

/**
 * Validated `DATABASE_URI`. Throws (instead of falling back to a local file)
 * when it is missing or points at another engine.
 *
 * During `next build` (e.g. `docker build`, where runtime secrets are usually
 * absent) an unreachable placeholder is used so the image can be built. CMS
 * reads fall back to the seed catalogues — the same behaviour as a fresh
 * install — and the app still refuses to *serve* without a real URI.
 */
export function databaseUri(): string {
  const uri = process.env.DATABASE_URI?.trim()

  if (!uri) {
    if (isBuildPhase) {
      console.warn(
        '[db] DATABASE_URI is not set during build — using an unreachable placeholder. ' +
          'CMS-backed pages will render from the seed catalogues in this build.',
      )
      return 'postgres://build-time-placeholder@127.0.0.1:1/build'
    }

    throw new Error(
      '[env] DATABASE_URI is required. Postgres is the only supported database, e.g. ' +
        'postgres://driveit:<password>@localhost:55432/driveit — see STAGING.md.',
    )
  }

  if (!isPostgresUri(uri)) {
    throw new DatabaseConfigError(
      `[env] DATABASE_URI must be a postgres:// URL (got "${describeDatabase(uri)}"). ` +
        'SQLite is no longer supported; see STAGING.md for the Postgres setup.',
    )
  }

  return uri
}

/** Human-readable target for logs/dashboards — never includes the password. */
export function describeDatabase(uri: string): string {
  try {
    const parsed = new URL(uri)
    const database = parsed.pathname.replace(/^\//, '') || '(default)'
    const scheme = parsed.protocol.replace(':', '')
    // Non-URL values (a stray `file:./driveit.db`, say) are echoed verbatim — the
    // point of this function is to make misconfiguration obvious in the logs.
    if (!parsed.hostname) return uri
    return `${scheme}://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}/${database}`
  } catch {
    return uri
  }
}

export function buildDatabaseAdapter({ uri, push }: { uri: string; push: boolean }) {
  return postgresAdapter({
    pool: {
      connectionString: uri,
      // One app instance needs ~10. Raise it per replica, and front Postgres with
      // PgBouncer once you run several — Postgres defaults to 100 total.
      max: Number(process.env.POSTGRES_POOL_MAX) || 10,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    },
    // Lets the importer insert documents with their original ids, which is what
    // makes a data move a copy instead of a re-keying job (see scripts/).
    allowIDOnCreate: true,
    migrationDir: migrationsDir,
    push,
  })
}
