import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Syncing Coupons table and Bookings columns in SQLite database:', dbPath)
  const db = new DatabaseSync(dbPath)

  // 1. Create Coupons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS "coupons" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "code" text NOT NULL,
      "discount_type" text DEFAULT 'percentage' NOT NULL,
      "discount_value" real NOT NULL,
      "is_active" integer DEFAULT 1,
      "valid_until" text,
      "usage_limit" integer DEFAULT 1,
      "usage_count" integer DEFAULT 0,
      "customer_email" text,
      "updated_at" text NOT NULL,
      "created_at" text NOT NULL
    );
  `)
  console.log('✅ Ensured coupons table exists')

  // Make code unique
  try {
    db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons" ("code");`)
    console.log('✅ Ensured coupons code index exists')
  } catch(e) {
    console.log('Index coupons_code_idx already exists or error:', e.message)
  }

  // 2. Add new columns to Bookings table
  const addColumn = (tableName, columnName, columnDefinition) => {
    try {
      db.exec(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${columnDefinition};`)
      console.log(`✅ Added ${columnName} to ${tableName}`)
    } catch (e) {
      if (e.message.includes('duplicate column name')) {
        console.log(`ℹ️ Column ${columnName} already exists in ${tableName}`)
      } else {
        console.error(`❌ Error adding ${columnName} to ${tableName}:`, e.message)
      }
    }
  }

  addColumn('bookings', 'start_date', 'text')
  addColumn('bookings', 'end_date', 'text')
  addColumn('bookings', 'coupon_code', 'text')
  addColumn('bookings', 'discount_applied', 'real DEFAULT 0')
  addColumn('bookings', 'hold_expires_at', 'text')
  addColumn('bookings', 'whatsapp_number', 'text')

  console.log('🎉 Database sync complete!')
} catch (error) {
  console.error('❌ Failed to sync database:', error)
}
