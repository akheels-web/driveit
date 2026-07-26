import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function sync() {
  console.log('Initializing Payload DB schema sync...')
  const payload = await getPayload({ config: configPromise })
  const cars = await payload.find({ collection: 'cars', limit: 1 })
  console.log('DB Schema Sync Complete! Found cars:', cars.totalDocs)
  process.exit(0)
}

sync().catch((err) => {
  console.error('Sync error:', err)
  process.exit(1)
})
