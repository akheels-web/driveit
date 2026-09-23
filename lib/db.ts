import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

/**
 * Database selection.
 *
 * The driver is inferred from `DATABASE_URI`, so a deployment switches by
 * changing one environment variable:
 *
 *   postgres://user:password@host:5432/driveit   → Postgres (production)
 *   file:./driveit.db                            → SQLite   (local development)
 *
 * Both adapters keep `idType: 'serial'`, i.e. numeric ids. That is deliberate:
 * it makes the two databases byte-compatible so `scripts/export-content.ts` +
 * `scripts/import-content.ts` can move data across without rewriting a single
 * relationship.
 *
 * Postgres is what production must use once more than one app instance runs —
 * SQLite has a single writer, so replicas would fight over one file.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** `migrations` next to this config; each driver keeps its own dialect there. */
const migrationsDir = path.resolve(dirname, '..', 'migrations')

export type DatabaseDriver = 'postgres' | 'sqlite'

export function databaseDriver(uri: string): DatabaseDriver {
  return /^postgres(ql)?:\/\//i.test(uri.trim()) ? 'postgres' : 'sqlite'
}

/** Human-readable target for logs/health checks — never includes the password. */
export function describeDatabase(uri: string): string {
  if (databaseDriver(uri) !== 'postgres') return uri
  try {
    const parsed = new URL(uri)
    return `postgres://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}${parsed.pathname}`
  } catch {
    return 'postgres://<unparsable DATABASE_URI>'
  }
}

export function buildDatabaseAdapter({ uri, push }: { uri: string; push: boolean }) {
  if (databaseDriver(uri) === 'postgres') {
    return postgresAdapter({
      pool: {
        connectionString: uri,
        // Enough for one app instance; raise it (and front it with PgBouncer)
        // when you run several replicas.
        max: Number(process.env.POSTGRES_POOL_MAX) || 10,
        connectionTimeoutMillis: 10_000,
      },
      // Lets the importer insert documents with their original ids, which is
      // what makes a SQLite → Postgres move a copy instead of a re-keying job.
      allowIDOnCreate: true,
      migrationDir: migrationsDir,
      push,
    })
  }

  return sqliteAdapter({
    client: { url: uri },
    // WAL lets readers continue while a write is in flight, and busyTimeout
    // makes concurrent writers wait instead of throwing SQLITE_BUSY.
    wal: { synchronous: 'NORMAL' },
    busyTimeout: 10_000,
    // Honour an explicit `id` on create. Without this the importer's ids are
    // silently dropped and every row is re-keyed — which quietly breaks
    // relationships and booking references. App code never passes an id, so this
    // only affects data tooling.
    allowIDOnCreate: true,
    push,
  })
}
