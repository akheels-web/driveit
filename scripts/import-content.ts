/**
 * Restores a directory produced by `scripts/export-content.ts`.
 *
 *   SEED_BASE_URL=http://localhost:3001 npm run import:content -- --dir=backup/<stamp>
 *
 * Typical use is a promotion or a restore: point this at the target instance
 * (start it, migrate its schema, then import), verify, then switch traffic over.
 *
 * Behaviour:
 *   • documents keep their original numeric ids, so relationships and the
 *     `DRV-00001`-style booking references stay intact;
 *   • existing documents (same id, or same slug/email/code) are skipped unless
 *     you pass `--update`, in which case they are overwritten field by field;
 *   • the script is safe to re-run — it never duplicates.
 *
 * After importing into Postgres you MUST resynchronise the id sequences,
 * otherwise the next insert reuses an id that already exists:
 *   docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB \
 *     < scripts/sql/fix-sequences.sql
 * (or `psql "$DATABASE_URI" -f scripts/sql/fix-sequences.sql`).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  api,
  authenticate,
  BASE,
  createDocument,
  documentExists,
  errorMessage,
  log,
  updateDocument,
} from './lib/admin-client'

type ExportedDoc = Record<string, any>

/** Import order matters: `media` first, everything that references it after. */
const IMPORT_ORDER = [
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

/** Fields Payload owns; sending them back is noise at best. */
const STRIP_FIELDS = new Set(['hash', 'salt', 'loginAttempts', 'lockUntil', '_verified'])

/**
 * Business key per collection — the fields that identify a document to a human.
 *
 * The "already present?" test must use these rather than the id alone: if the
 * target ever re-keys a row (see the id check below), an id-only test decides
 * the whole import based on an irrelevant number and silently skips data.
 * This exact bug cost half the fleet during the first round-trip test.
 */
const NATURAL_KEY: Record<string, string[]> = {
  media: ['filename'],
  cars: ['slug'],
  services: ['slug'],
  testimonials: ['author'],
  blogs: ['slug'],
  customers: ['email'],
  coupons: ['code'],
  bookings: ['carSlug', 'startDate', 'customerEmail'],
  wishlists: ['userEmail', 'carSlug'],
}

function flag(name: string): string | undefined {
  const entry = process.argv.find((arg) => arg.startsWith(`--${name}=`))
  return entry?.slice(name.length + 3)
}

function has(name: string) {
  return process.argv.includes(`--${name}`)
}

function readCollection(dir: string, collection: string): ExportedDoc[] {
  const file = path.join(dir, `${collection}.json`)
  if (!fs.existsSync(file)) return []
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
  return Array.isArray(parsed?.docs) ? parsed.docs : []
}

function readGlobal(dir: string, slug: string): ExportedDoc | null {
  const file = path.join(dir, `${slug}.global.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

async function idExists(collection: string, id: string | number, token: string) {
  const result = await api(`/api/${collection}/${id}?depth=0`, { token })
  return result.ok
}

/**
 * Decides whether a source document is already in the target.
 *
 * Natural key first (meaningful), id second (primary-key clash guard).
 */
async function alreadyImported(
  collection: string,
  doc: Record<string, any>,
  uniqueFields: string[],
  token: string,
): Promise<boolean> {
  const matches: Record<string, unknown> = {}
  for (const field of uniqueFields) {
    if (doc[field] !== undefined && doc[field] !== null && doc[field] !== '') matches[field] = doc[field]
  }

  if (Object.keys(matches).length === uniqueFields.length) {
    if (await documentExists(collection, matches, token)) return true
  }

  return idExists(collection, doc.id, token)
}

async function main() {
  const dir = flag('dir')
  if (!dir) throw new Error('Pass the export directory: --dir=backup/<stamp>')

  const source = path.resolve(process.cwd(), dir)
  if (!fs.existsSync(source)) throw new Error(`No such directory: ${source}`)

  const update = has('update')
  const dryRun = has('dry-run')
  const skipMedia = has('skip-media')

  const idMismatches: { collection: string; sourceId: string | number; targetId: string | number }[] = []

  const { token } = await authenticate()
  log(`importing ${path.relative(process.cwd(), source)} → ${BASE}${dryRun ? ' (dry run)' : ''}`)

  for (const collection of IMPORT_ORDER) {
    if (collection === 'media' && skipMedia) {
      log('media: skipped (--skip-media)')
      continue
    }

    const docs = readCollection(source, collection)
    if (docs.length === 0) continue

    const stats = { created: 0, updated: 0, skipped: 0 }
    const uniqueFields = NATURAL_KEY[collection] ?? []

    for (const doc of docs) {
      const { id, createdAt, updatedAt, ...rest } = doc
      const data: ExportedDoc = { ...rest }

      for (const field of STRIP_FIELDS) delete data[field]

      // Timestamps are re-stamped by the target database; keeping the originals
      // would only make the import depend on column-level write permissions.
      void createdAt
      void updatedAt

      if (await alreadyImported(collection, doc, uniqueFields, token)) {
        if (!update) {
          stats.skipped += 1
          continue
        }
        if (!dryRun) await updateDocument(collection, id, data, token)
        stats.updated += 1
        continue
      }

      if (!dryRun) {
        // `id` is honoured only when the target adapter runs with
        // allowIDOnCreate (both adapters do — see lib/db.ts). Verify it instead
        // of trusting it: a re-keyed row breaks relationships and booking
        // references silently.
        const created = await createDocument<{ id?: string | number }>(
          collection,
          { id, ...data },
          token,
        )

        if (created?.id !== undefined && String(created.id) !== String(id)) {
          idMismatches.push({ collection, sourceId: id, targetId: created.id })
        }
      }
      stats.created += 1
    }

    log(
      `${collection}: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} already present`,
    )
  }

  // Globals are singletons: always overwrite so the branding matches the export.
  for (const slug of ['site-settings']) {
    const data = readGlobal(source, slug)
    if (!data) continue
    const { id, createdAt, updatedAt, ...rest } = data
    void id
    void createdAt
    void updatedAt

    if (!dryRun) {
      const result = await api(`/api/globals/${slug}`, {
        method: 'POST',
        token,
        body: JSON.stringify(rest),
      })
      if (!result.ok) {
        throw new Error(`Updating global ${slug} failed (HTTP ${result.status}): ${errorMessage(result.body)}`)
      }
    }
    log(`global ${slug}: written`)
  }

  if (idMismatches.length > 0) {
    log('---------------------------------------------------------------')
    log(`WARNING: ${idMismatches.length} document(s) were stored under a different id.`)
    log('The target database re-keyed them, which means the adapter is not honouring')
    log('explicit ids (allowIDOnCreate, see lib/db.ts). Relationships and booking')
    log('references that point at those ids are now wrong.')
    for (const mismatch of idMismatches.slice(0, 10)) {
      log(`  ${mismatch.collection}: ${mismatch.sourceId} → ${mismatch.targetId}`)
    }
    if (idMismatches.length > 10) log(`  …and ${idMismatches.length - 10} more`)
    log('Fix the adapter, wipe the target, and import again before switching traffic.')
    log('---------------------------------------------------------------')
    process.exitCode = 2
  }

  if (dryRun) {
    log('dry run complete — nothing was written')
    return
  }

  log('---------------------------------------------------------------')
  log('Next steps:')
  log('  1. Resync id sequences on Postgres (REQUIRED, or the next insert collides):')
  log('     psql "$DATABASE_URI" -f scripts/sql/fix-sequences.sql')
  log('  2. Copy uploaded files to the new instance (media rows point at files):')
  log('     docker compose cp ./media-backup driveit-app:/app/public/media')
  log('  3. Staff accounts must reset their passwords — password hashes are not exported.')
  log('  4. Smoke test: /api/fleet, /cars, /blog, and one full checkout + confirm.')
  log('---------------------------------------------------------------')
}

main().catch((error) => {
  console.error(`[driveit] ${error instanceof Error ? error.message : errorMessage(error)}`)
  process.exit(1)
})
