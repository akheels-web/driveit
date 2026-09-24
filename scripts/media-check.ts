/**
 * Media storage check — two parts, so this is useful in CI either way.
 *
 *   npm run media:check
 *
 * 1. **Offline**: proves the URL maths. Payload's sized filenames
 *    (`photo-400x300.png`), the deterministic public id, and the exact CDN URL
 *    for an image, a derived size and a PDF are all computed and asserted. This
 *    runs everywhere, with no credentials and no network.
 *
 * 2. **Live** (only when CLOUDINARY_* is set): uploads a generated test image,
 *    fetches the very URL the CMS would put in a document, deletes the asset and
 *    confirms it is gone. Run this once after adding the credentials, and again
 *    whenever you rotate the keys.
 */
import assert from 'node:assert/strict'

import sharp from 'sharp'

import {
  cloudinarySettings,
  deliveryUrl,
  destroyAsset,
  publicIdFor,
  sizeFromFilename,
  uploadBuffer,
} from '../lib/cloudinary'

for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // Missing env files are fine; real env vars win.
  }
}

const SAMPLE_CLOUD = 'driveit-sample'

/** A document as the adapter leaves it after the metadata write. */
const sampleDoc = {
  filename: 'photo.png',
  cloudinaryPublicId: 'driveit/photo',
  cloudinaryResourceType: 'image',
  cloudinaryFormat: 'png',
  cloudinaryVersion: 1727000000,
}

const sampleSettings = {
  cloudName: SAMPLE_CLOUD,
  apiKey: 'key',
  apiSecret: 'secret',
  folder: 'driveit',
}

function checkUrls() {
  console.log('\n[media:check] URL shape (offline)\n')

  const size = sizeFromFilename('photo-400x300.png')
  assert.deepEqual(size, { width: 400, height: 300 }, 'size filename must parse')
  console.log('  ✓ size filename photo-400x300.png → 400×300')

  assert.equal(sizeFromFilename('photo.png'), null, 'an original filename is not a size')
  assert.equal(publicIdFor('photo.png', 'driveit'), 'driveit/photo', 'public id is folder/base')
  assert.equal(
    publicIdFor('/tmp/uploads/photo.2.png', 'driveit'),
    'driveit/photo.2',
    'only the extension is stripped',
  )
  console.log('  ✓ public id driveit/photo (folders stripped, extension dropped)')

  // Browser-native formats are delivered without an extension (Cloudinary picks
  // the stored format), so the URL cannot go stale if a file is re-uploaded as
  // WebP — and it must carry no analytics token.
  const original = deliveryUrl({ settings: sampleSettings, data: sampleDoc, filename: 'photo.png' })
  assert.match(
    original,
    /^https:\/\/res\.cloudinary\.com\/driveit-sample\/image\/upload\/v1727000000\/driveit\/photo$/,
    `unexpected original URL: ${original}`,
  )
  assert.ok(!original.includes('?'), `URL must be free of query tokens: ${original}`)
  console.log(`  ✓ original   ${original}`)

  const thumbnail = deliveryUrl({
    settings: sampleSettings,
    data: sampleDoc,
    filename: 'photo-400x300.png',
    transformation: { width: 400, height: 300, crop: 'fill' },
  })
  assert.match(thumbnail, /image\/upload\/c_fill,h_300,w_400\//, `unexpected size URL: ${thumbnail}`)
  assert.match(thumbnail, /driveit\/photo$/, 'a size must point at the same asset, transformed')
  console.log(`  ✓ size       ${thumbnail}`)

  // A PDF is not in Cloudinary's extension-less set, so it must keep its suffix.
  const pdf = deliveryUrl({
    settings: sampleSettings,
    data: { ...sampleDoc, cloudinaryFormat: 'pdf', cloudinaryPublicId: 'driveit/brochure' },
    filename: 'brochure.pdf',
  })
  assert.match(pdf, /driveit\/brochure\.pdf$/, `unexpected pdf URL: ${pdf}`)
  console.log(`  ✓ pdf        ${pdf}`)

  // If the metadata write ever failed, the URL still resolves from the filename.
  const fallback = deliveryUrl({
    settings: sampleSettings,
    data: { filename: 'legacy.png' },
    filename: 'legacy.png',
  })
  assert.match(fallback, /driveit\/legacy$/, `unexpected fallback URL: ${fallback}`)
  console.log(`  ✓ fallback   ${fallback}  (no stored metadata)`)
}

async function checkLive() {
  const settings = cloudinarySettings()

  if (!settings) {
    console.log(
      '\n[media:check] live upload skipped — CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not set.\n',
    )
    return
  }

  console.log(`\n[media:check] live upload — cloud "${settings.cloudName}", folder "${settings.folder}"\n`)

  const png = await sharp({
    create: { width: 640, height: 480, channels: 3, background: { r: 15, g: 15, b: 15 } },
  })
    .png()
    .toBuffer()

  const filename = `media-check-${Date.now()}.png`
  const expectedPublicId = publicIdFor(filename, settings.folder)

  const asset = await uploadBuffer(png, { publicId: expectedPublicId, mimeType: 'image/png' })
  console.log(`  ✓ uploaded   public_id=${asset.public_id} (${asset.bytes ?? '?'} bytes)`)

  if (asset.public_id !== expectedPublicId) {
    console.warn(
      `  ! public_id differs from the deterministic name (${expectedPublicId}); URLs stay exact because the id is stored on the document.`,
    )
  }

  const doc = {
    filename,
    cloudinaryPublicId: asset.public_id,
    cloudinaryResourceType: asset.resource_type,
    cloudinaryFormat: asset.format,
    cloudinaryVersion: asset.version,
  }

  const originalUrl = deliveryUrl({ settings, data: doc, filename })
  const thumbnailUrl = deliveryUrl({
    settings,
    data: doc,
    filename: filename.replace(/\.png$/, '-400x300.png'),
    transformation: { width: 400, height: 300, crop: 'fill' },
  })

  for (const [label, url] of [
    ['original', originalUrl],
    ['thumbnail', thumbnailUrl],
  ] as const) {
    const response = await fetch(url)
    const type = response.headers.get('content-type') ?? '?'
    console.log(`  ${response.ok ? '✓' : '✗'} ${label.padEnd(9)} HTTP ${response.status} ${type} ${url}`)
    assert.ok(response.ok, `${label} URL did not resolve: ${url}`)
  }

  await destroyAsset(asset.public_id, asset.resource_type)
  const afterDelete = await fetch(originalUrl)
  console.log(
    `  ${afterDelete.ok ? '✗' : '✓'} deleted    HTTP ${afterDelete.status} (404 expected — the asset is gone)`,
  )
  assert.ok(!afterDelete.ok, 'asset is still served after delete')
}

async function main() {
  checkUrls()
  await checkLive()
  console.log('\n[media:check] all good.\n')
}

main().catch((error) => {
  console.error(`\n[media:check] ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
