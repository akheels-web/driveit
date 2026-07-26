import Database from 'better-sqlite3'
import path from 'path'

try {
  const dbPath = path.resolve(process.cwd(), 'driveit.db')
  console.log('Enabling WAL mode on:', dbPath)
  const db = new Database(dbPath)

  const walResult = db.pragma('journal_mode = WAL')
  console.log('Journal Mode set to:', walResult)

  db.pragma('busy_timeout = 10000')
  db.pragma('synchronous = NORMAL')

  console.log('SQLite WAL mode enabled successfully!')
  db.close()
} catch (e) {
  console.log('Note on WAL enabling:', e.message)
}
