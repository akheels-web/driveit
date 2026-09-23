/**
 * Exports everything in the CMS to JSON files.
 *
 *   SEED_BASE_URL=http://localhost:3000 npm run export:content
 *   SEED_BASE_URL=http://localhost:3000 npm run export:content -- --out=backup/pre-cutover
 *
 * Used for two things:
 *   • the SQLite → Postgres cutover (export from the old instance, import into
 *     the new one with `npm run import:content`)
 *   • an ad-hoc backup before risky schema work
 *
 * Not included:
 *   • uploaded files — `media` records point at files on disk (or S3). Those
 *     files are copied separately; see the note this script prints.
 *   • staff password hashes — Payload never returns them. Imported staff
 *     accounts must reset their passwords.
 *
 * The output is plain documents with numeric ids, so `import-content.ts` can
 * restore them into a database with the same table shapes (SQLite ↔ Postgres).
 */
import fs from 'node:fs'
import path from 'node:path'

import { authenticate, BASE, errorMessage, fetchAll, fetchGlobal, log } from './lib/admin-client'

/** Import order matters for relationships (media is referenced by the others). */
const COLLECTIONS = [
  'media',
  'cars',
  'services',
  'testimonials',
  'blogs',
  'customers',
  'coupons',
  'bookings',
  'wishlists',
] as const

const GLOBALS = ['site-settings'] as const

function outDirFromArgs(defaultName: string): string {
  const flag = process.argv.find((arg) => arg.startsWith('--out='))
  if (flag) return path.resolve(process.cwd(), flag.slice('--out='.length))

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return path.resolve(process.cwd(), defaultName, stamp)
}

async function main() {
  const { token } = await authenticate()
  const dir = outDirFromArgs('backup')

  fs.mkdirSync(dir, { recursive: true })
  log(`exporting from ${BASE} → ${path.relative(process.cwd(), dir)}`)

  const manifest: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    source: BASE,
    collections: {},
    globals: {},
  }
  let total = 0

  for (const collection of COLLECTIONS) {
    const docs = await fetchAll(collection, token, { depth: 0 })

    fs.writeFileSync(
      path.join(dir, `${collection}.json`),
      JSON.stringify({ collection, exportedAt: manifest.exportedAt, count: docs.length, docs }, null, 2),
    )

    ;(manifest.collections as Record<string, number>)[collection] = docs.length
    total += docs.length
    log(`${collection}: ${docs.length}`)
  }

  for (const slug of GLOBALS) {
    const data = await fetchGlobal(slug, token)
    fs.writeFileSync(path.join(dir, `${slug}.global.json`), JSON.stringify(data, null, 2))
    ;(manifest.globals as Record<string, unknown>)[slug] = 'ok'
    log(`global ${slug}: saved`)
  }

  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2))

  log(`${total} documents + ${GLOBALS.length} global(s) exported`)

  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (fs.existsSync(mediaDir)) {
    log('---------------------------------------------------------------')
    log('Uploaded files are NOT in this export. Copy the media directory too:')
    log(`  ${mediaDir}`)
    log('In Docker:  docker compose cp driveit-app:/app/public/media ./media-backup')
    log('---------------------------------------------------------------')
  }
}

main().catch((error) => {
  console.error(`[driveit] ${error instanceof Error ? error.message : errorMessage(error)}`)
  process.exit(1)
})
