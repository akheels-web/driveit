import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'

/**
 * Database: Postgres, and only Postgres.
 *
 * Locally, run Postgres in Docker:
 *   docker compose -f docker-compose.yml -f docker-compose.local.yml up -d postgres redis
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
    if (!parsed.hostname) return uri
    return `${scheme}://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}/${database}`
  } catch {
    return uri
  }
}

/**
 * Fast (<120ms) TCP socket probe to check if Postgres is accepting connections.
 * Prevents Payload's `@payloadcms/db-postgres` from hanging or calling
 * `this.rejectInitializing()` with `undefined` when local Docker Postgres is stopped.
 */
let reachabilityCache: { ok: boolean; expiresAt: number } | null = null

export async function isPostgresReachable(timeoutMs = 150): Promise<boolean> {
  const now = Date.now()
  if (reachabilityCache && reachabilityCache.expiresAt > now) {
    return reachabilityCache.ok
  }

  let host = '127.0.0.1'
  let port = 5432
  try {
    const uri = process.env.DATABASE_URI?.trim()
    if (!uri) return false
    const parsed = new URL(uri)
    host = parsed.hostname || '127.0.0.1'
    port = Number(parsed.port) || 5432
  } catch {
    return false
  }

  const ok = await new Promise<boolean>((resolve) => {
    const socket = new net.Socket()
    let settled = false
    const finish = (result: boolean) => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve(result)
    }

    socket.setTimeout(timeoutMs)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
    socket.connect(port, host)
  })

  // Cache positive reachability for 30s, negative for 15s
  reachabilityCache = {
    ok,
    expiresAt: Date.now() + (ok ? 30_000 : 15_000),
  }
  return ok
}

export function buildDatabaseAdapter({ uri, push }: { uri: string; push: boolean }) {
  const base = postgresAdapter({
    pool: {
      connectionString: uri,
      max: Number(process.env.POSTGRES_POOL_MAX) || 10,
      connectionTimeoutMillis: 2_500,
      idleTimeoutMillis: 30_000,
    },
    allowIDOnCreate: true,
    migrationDir: migrationsDir,
    push,
  })

  // Guard against `@payloadcms/db-postgres` calling `this.rejectInitializing()`
  // with `undefined` (which triggers Next.js `unhandledRejection: undefined`).
  const origInit = base.init
  base.init = function wrappedInit(args: any) {
    const adapter = origInit.call(this, args) as any
    if (adapter?.initializing && typeof adapter.initializing.catch === 'function') {
      adapter.initializing.catch(() => {
        // Swallowed here so Node.js / Turbopack never sees an unhandled rejection
      })
    }
    if (typeof adapter?.rejectInitializing === 'function') {
      const origReject = adapter.rejectInitializing
      adapter.rejectInitializing = (reason?: unknown) => {
        origReject(reason ?? new Error('Postgres initialization failed'))
      }
    }
    return adapter
  }

  return base
}
