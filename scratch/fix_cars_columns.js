import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Inspecting cars table columns in:', dbPath)
  const db = new DatabaseSync(dbPath)

  const columns = db.prepare("PRAGMA table_info('cars')").all()
  console.log('Current Cars columns:', columns.map((c) => c.name))

  if (!columns.some((c) => c.name === 'price_per_day')) {
    db.exec('ALTER TABLE "cars" ADD COLUMN "price_per_day" numeric DEFAULT 15000;')
    console.log('Added missing price_per_day column to cars table!')
  }

  // Also check other fields if any missing
  if (!columns.some((c) => c.name === 'fuel_type')) {
    db.exec('ALTER TABLE "cars" ADD COLUMN "fuel_type" text DEFAULT \'Petrol\';')
    console.log('Added missing fuel_type column to cars table!')
  }
} catch (e) {
  console.error('Error fixing cars columns:', e)
}
