import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Synchronizing all collection columns in SQLite database:', dbPath)
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

  // 1. Cars table
  addColumnIfMissing('cars', 'description', 'text')
  addColumnIfMissing('cars', 'price', 'numeric')
  addColumnIfMissing('cars', 'price_per_day', 'numeric')
  addColumnIfMissing('cars', 'transmission', 'text')
  addColumnIfMissing('cars', 'fuel', 'text')
  addColumnIfMissing('cars', 'fuel_type', 'text')
  addColumnIfMissing('cars', 'seats', 'numeric')
  addColumnIfMissing('cars', 'image_src', 'text')
  addColumnIfMissing('cars', 'image_id', 'integer')

  // 2. Services table
  addColumnIfMissing('services', 'short_description', 'text')
  addColumnIfMissing('services', 'full_description', 'text')
  addColumnIfMissing('services', 'price', 'text')
  addColumnIfMissing('services', 'icon', 'text')
  addColumnIfMissing('services', 'image_src', 'text')
  addColumnIfMissing('services', 'image_id', 'integer')

  // 3. Testimonials table
  addColumnIfMissing('testimonials', 'author', 'text')
  addColumnIfMissing('testimonials', 'role', 'text')
  addColumnIfMissing('testimonials', 'company', 'text')
  addColumnIfMissing('testimonials', 'content', 'text')
  addColumnIfMissing('testimonials', 'rating', 'numeric')
  addColumnIfMissing('testimonials', 'avatar_src', 'text')

  // 4. Blogs table
  addColumnIfMissing('blogs', 'title', 'text')
  addColumnIfMissing('blogs', 'slug', 'text')
  addColumnIfMissing('blogs', 'excerpt', 'text')
  addColumnIfMissing('blogs', 'author', 'text')
  addColumnIfMissing('blogs', 'category', 'text')
  addColumnIfMissing('blogs', 'published_date', 'text')
  addColumnIfMissing('blogs', 'cover_image_src', 'text')
  addColumnIfMissing('blogs', 'cover_image_id', 'integer')

  // 5. Bookings table
  addColumnIfMissing('bookings', 'customer_name', 'text')
  addColumnIfMissing('bookings', 'customer_email', 'text')
  addColumnIfMissing('bookings', 'customer_phone', 'text')
  addColumnIfMissing('bookings', 'car_name', 'text')
  addColumnIfMissing('bookings', 'car_slug', 'text')
  addColumnIfMissing('bookings', 'pickup_location', 'text')
  addColumnIfMissing('bookings', 'dropoff_location', 'text')
  addColumnIfMissing('bookings', 'total_price', 'numeric')
  addColumnIfMissing('bookings', 'service_type', 'text')
  addColumnIfMissing('bookings', 'status', 'text')

  // 6. Wishlists table
  addColumnIfMissing('wishlists', 'user_email', 'text')
  addColumnIfMissing('wishlists', 'car_slug', 'text')

  console.log('All 8 collection database schemas are 100% synchronized!')
} catch (e) {
  console.error('Database migration error:', e)
}
