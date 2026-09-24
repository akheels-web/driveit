/**
 * Uploads local fleet assets to Cloudinary.
 *
 * Usage:
 *   npx tsx scripts/upload-fleet-cloudinary.ts
 *
 * This scans `public/sadan`, `public/suv`, `public/trending`, and prominent car assets
 * in `public/`, uploads them to Cloudinary under `driveit/fleet/`, and outputs a URL map.
 */
import fs from 'node:fs'
import path from 'node:path'
import { cloudinarySettings, uploadBuffer } from '../lib/cloudinary'

for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // Missing env files are fine; real env vars win.
  }
}

const settings = cloudinarySettings()
if (!settings) {
  console.log('\n[cloudinary-upload] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set in .env.local to run this script.\n')
  process.exit(1)
}

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const TARGET_FOLDERS = ['sadan', 'suv', 'trending']

async function uploadFile(fullPath: string, relativePath: string) {
  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(relativePath)
  const baseName = path.basename(relativePath, ext)
  const dirName = path.dirname(relativePath).replace(/\\/g, '/')
  const cleanDir = dirName === '.' ? '' : `${dirName}/`

  const publicId = `${settings!.folder}/fleet/${cleanDir}${baseName}`
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg'

  try {
    const asset = await uploadBuffer(buffer, { publicId, mimeType })
    console.log(`  ✓ Uploaded: ${relativePath} → ${asset.secure_url || asset.public_id}`)
    return { localPath: `/${relativePath.replace(/\\/g, '/')}`, publicId: asset.public_id, url: asset.secure_url }
  } catch (err: any) {
    console.error(`  ✗ Failed: ${relativePath} — ${err?.message || err}`)
    return null
  }
}

async function main() {
  console.log(`\n[cloudinary-upload] Starting asset upload to cloud "${settings!.cloudName}" folder "${settings!.folder}/fleet"...\n`)

  const results: Record<string, string> = {}

  for (const folder of TARGET_FOLDERS) {
    const folderPath = path.join(PUBLIC_DIR, folder)
    if (!fs.existsSync(folderPath)) continue

    const files = fs.readdirSync(folderPath).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    for (const file of files) {
      const rel = path.join(folder, file)
      const res = await uploadFile(path.join(folderPath, file), rel)
      if (res?.url) {
        results[res.localPath] = res.url
      }
    }
  }

  const outPath = path.resolve(process.cwd(), 'cloudinary-fleet-map.json')
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`\n[cloudinary-upload] Finished. Upload mapping written to ${outPath}\n`)
}

main().catch((err) => {
  console.error('\n[cloudinary-upload] Error:', err)
  process.exit(1)
})
