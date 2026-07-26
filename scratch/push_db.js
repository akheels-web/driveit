import { getPayload } from 'payload'
import config from '../payload.config.js'

async function pushDb() {
  try {
    console.log('Initializing Payload to push database schema...')
    // Initialize Payload. Because push: true is set in the config,
    // this will automatically synchronize the DB schema.
    const payload = await getPayload({ config })
    console.log('✅ Database schema synchronized successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to synchronize database:', err)
    process.exit(1)
  }
}

pushDb()
