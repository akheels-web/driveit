import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Inspecting database with native node:sqlite:', dbPath)
  const db = new DatabaseSync(dbPath)

  db.exec('DROP TABLE IF EXISTS "cars_services";')
  console.log('Dropped ambiguous cars_services table successfully!')

  const query = db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
  console.log('Current SQLite tables:', query.all().map(t => t.name))
} catch (e) {
  console.error('Error cleaning schema:', e)
}
