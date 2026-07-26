import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Syncing all table columns in SQLite database:', dbPath)
  const db = new DatabaseSync(dbPath)

  function addColumnIfMissing(table, colName, colType) {
    try {
      const columns = db.prepare(`PRAGMA table_info('${table}')`).all()
      if (columns.length > 0 && !columns.some((c) => c.name === colName)) {
        db.exec(`ALTER TABLE "${table}" ADD COLUMN "${colName}" ${colType};`)
        console.log(`✓ Added missing column "${colName}" to table "${table}"`)
      }
    } catch (e) {
      console.error(`Error on ${table}.${colName}:`, e.message)
    }
  }

  // Services table columns
  addColumnIfMissing('services', 'short_description', 'text')
  addColumnIfMissing('services', 'full_description', 'text')
  addColumnIfMissing('services', 'image_src', 'text')
  addColumnIfMissing('services', 'image_id', 'integer')

  // Cars table columns
  addColumnIfMissing('cars', 'price_per_day', 'numeric')
  addColumnIfMissing('cars', 'fuel_type', 'text')

  // Testimonials table columns
  addColumnIfMissing('testimonials', 'avatar_src', 'text')
  addColumnIfMissing('testimonials', 'rating', 'numeric')

  // Blogs table columns
  addColumnIfMissing('blogs', 'cover_image_src', 'text')
  addColumnIfMissing('blogs', 'published_date', 'text')

  console.log('All database table columns synced successfully!')
} catch (e) {
  console.error('Database migration error:', e)
}
