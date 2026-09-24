/**
 * Migration runner.
 *
 *   npm run migrate:create -- initial    # generate SQL from the collections
 *   npm run migrate                      # apply pending migrations
 *   npm run migrate:status               # what is applied / pending
 *   npm run migrate:down                 # roll back the last batch
 *
 * Why this exists instead of `payload migrate:create` directly:
 *
 * The Payload CLI transpiles `payload.config.ts` with `tsx`'s CommonJS require
 * hook, which breaks on Node 22+ ESM graphs ("require() cannot be used on an
 * ESM graph with top-level await") and its `--disable-transpile` fallback then
 * fails to resolve extensionless TS imports. This script is the same call the
 * CLI makes (`payload.init` → `adapter.createMigration` / `adapter.migrate`),
 * but loaded through the project's own module setup, so it works on the Node
 * version you actually have.
 *
 * Env is loaded the way Next.js and the Payload CLI load it (.env.local wins
 * over .env), so migrations always target the database the app would use.
 */
// Side-effect import: must come before `payload` (see the file for details).
import './lib/payload-interop'

// Must run before payload.config.ts is imported — the config reads
// DATABASE_URI and PAYLOAD_SECRET at module scope and fails fast without them.
//
// Loaded with Node's own env-file support (no extra dependency), in the same
// precedence order Next.js uses: .env.local overrides .env.
for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // Missing file is fine; real env vars (CI, Docker) still take part.
  }
}

type Command = 'create' | 'up' | 'down' | 'status' | 'refresh'

const COMMANDS: Record<string, Command> = {
  create: 'create',
  up: 'up',
  down: 'down',
  status: 'status',
  refresh: 'refresh',
  // Aliases so the familiar CLI words keep working.
  'migrate:create': 'create',
  migrate: 'up',
  'migrate:down': 'down',
  'migrate:status': 'status',
  'migrate:refresh': 'refresh',
}

function parseArgs() {
  const argv = process.argv.slice(2)
  const raw = argv[0] || 'up'
  const command = COMMANDS[raw]

  if (!command) {
    console.error(
      `[migrate] Unknown command "${raw}". Use one of: ${Object.keys(COMMANDS).slice(0, 5).join(', ')}`,
    )
    process.exit(1)
  }

  const name = command === 'create' ? argv[1] : undefined
  const skipEmpty = argv.includes('--skip-empty') || argv.includes('--skipEmpty')
  const forceAcceptWarning = argv.includes('--force') || argv.includes('--forceAcceptWarning')

  return { command, name, skipEmpty, forceAcceptWarning }
}

async function main() {
  const { command, name, skipEmpty, forceAcceptWarning } = parseArgs()
  const { default: payload } = await import('payload')
  const { default: config } = await import('../payload.config')

  // Mirrors payload/dist/bin/migrate.js so behaviour matches the CLI exactly.
  process.env.PAYLOAD_MIGRATING = 'true'

  await payload.init({
    config,
    disableDBConnect: command === 'create',
    disableOnInit: true,
  })

  const adapter = payload.db as unknown as {
    migrate: () => Promise<void>
    migrateDown: () => Promise<void>
    migrateRefresh: () => Promise<void>
    migrateStatus: () => Promise<void>
    createMigration: (args: Record<string, unknown>) => Promise<void>
  }

  if (!adapter) throw new Error('[migrate] No database adapter found.')

  switch (command) {
    case 'create':
      await adapter.createMigration({ migrationName: name, payload, skipEmpty, forceAcceptWarning })
      break
    case 'up':
      await adapter.migrate()
      break
    case 'down':
      await adapter.migrateDown()
      break
    case 'refresh':
      await adapter.migrateRefresh()
      break
    case 'status':
      await adapter.migrateStatus()
      break
  }

  process.exit(0)
}

main().catch((error) => {
  console.error(`[migrate] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
