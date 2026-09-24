/**
 * Creates the first CMS admin (or resets an existing one's password).
 *
 *   ADMIN_PASSWORD='a-strong-password' npm run create:admin -- --email you@example.com
 *
 * Why this exists:
 *   • A fresh Postgres database has no users at all, and Payload's REST API
 *     needs an existing admin to create one — a chicken-and-egg problem on the
 *     first deploy.
 *   • Staff password hashes are never exported (Payload does not return them),
 *     so a data move cannot carry logins across. This is how you regain access
 *     to the target instance.
 *
 * Uses Payload's local API, so it does not need the app to be running — only
 * DATABASE_URI. Safe to re-run: an existing user is left alone unless
 * `--reset-password` is passed.
 */
import { randomBytes } from 'node:crypto'

import './lib/payload-interop'

for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // Missing env files are fine; real env vars win.
  }
}

function argValue(name: string): string | undefined {
  const prefix = `--${name}=`
  const inline = process.argv.find((arg) => arg.startsWith(prefix))
  if (inline) return inline.slice(prefix.length)

  const index = process.argv.indexOf(`--${name}`)
  return index !== -1 ? process.argv[index + 1] : undefined
}

async function main() {
  const email = (
    argValue('email') ||
    process.env.SEED_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    ''
  )
    .trim()
    .toLowerCase()

  const password = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD
  const resetPassword = process.argv.includes('--reset-password')
  const role = argValue('role') === 'editor' ? 'editor' : 'admin'

  if (!email) {
    throw new Error('Provide --email you@example.com (or set SEED_ADMIN_EMAIL).')
  }
  if (!password || password.length < 8) {
    throw new Error('Set ADMIN_PASSWORD to at least 8 characters (Payload enforces a minimum).')
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  const first = existing.docs[0] as { id: number | string } | undefined

  if (first && !resetPassword) {
    payload.logger.info(`[admin] ${email} already exists (id ${first.id}) — nothing to do.`)
    process.exit(0)
  }

  if (first) {
    await payload.update({
      collection: 'users',
      id: first.id,
      data: { password, role },
      overrideAccess: true,
    })
    payload.logger.info(`[admin] Password reset for ${email} (id ${first.id}).`)
    process.exit(0)
  }

  const created = await payload.create({
    collection: 'users',
    data: { email, password, role, name: 'Site Admin' },
    overrideAccess: true,
  })

  payload.logger.info(`[admin] Created ${email} (id ${created.id}, role ${role}).`)
  if (!process.env.ADMIN_PASSWORD && !process.env.SEED_ADMIN_PASSWORD) {
    // Should not happen — guarded above — but never print a silent blank.
    payload.logger.info(`[admin] Generated password: ${randomBytes(12).toString('base64url')}`)
  }
  process.exit(0)
}

main().catch((error) => {
  console.error(`[admin] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
