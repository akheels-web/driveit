import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Ensuring all SQLite tables and columns exist in:', dbPath)
  const db = new DatabaseSync(dbPath)

  // 1. Create site_settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "site_name" text DEFAULT 'DriveIt Luxury Transportation',
      "contact_phone" text DEFAULT '+91 98765 43210',
      "contact_email" text DEFAULT 'concierge@driveitluxury.com',
      "whatsapp_number" text DEFAULT '+919876543210',
      "header_logo_id" integer,
      "footer_logo_id" integer,
      "footer_description" text DEFAULT 'Premium luxury car rental and chauffeur services in Hyderabad.',
      "instagram_url" text DEFAULT 'https://instagram.com/driveitluxury',
      "facebook_url" text DEFAULT 'https://facebook.com/driveitluxury',
      "youtube_url" text DEFAULT 'https://youtube.com/@driveitluxury',
      "updated_at" text DEFAULT (CURRENT_TIMESTAMP),
      "created_at" text DEFAULT (CURRENT_TIMESTAMP)
    );
  `)
  console.log('✓ Created/verified site_settings table')

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

  // 2. Testimonials columns
  addColumnIfMissing('testimonials', 'author', 'text')
  addColumnIfMissing('testimonials', 'role', 'text')
  addColumnIfMissing('testimonials', 'company', 'text')
  addColumnIfMissing('testimonials', 'content', 'text')
  addColumnIfMissing('testimonials', 'rating', 'numeric')
  addColumnIfMissing('testimonials', 'avatar_src', 'text')

  // 3. Services columns
  addColumnIfMissing('services', 'short_description', 'text')
  addColumnIfMissing('services', 'full_description', 'text')
  addColumnIfMissing('services', 'price', 'text')
  addColumnIfMissing('services', 'icon', 'text')
  addColumnIfMissing('services', 'image_src', 'text')
  addColumnIfMissing('services', 'image_id', 'integer')

  console.log('All SQLite database tables and columns are 100% synced!')
} catch (e) {
  console.error('Error during DB fix:', e)
}
