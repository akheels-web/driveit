import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Cars } from './collections/Cars'
import { Blogs } from './collections/Blogs'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Bookings } from './collections/Bookings'
import { Wishlists } from './collections/Wishlists'
import { Coupons } from './collections/Coupons'
import { SiteSettings } from './globals/SiteSettings'
import { withRevalidation } from './lib/revalidate'
import { requiredSecret } from './lib/env'
import { buildDatabaseAdapter, databaseDriver, describeDatabase } from './lib/db'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

// Schema auto-push is a development convenience. Production should run Payload
// migrations (`payload migrate`) so a deploy can never mutate the live schema.
// Set PAYLOAD_SCHEMA_PUSH=true to temporarily allow push in production (e.g. for
// a first deploy that has no migrations yet).
const pushSchema = process.env.PAYLOAD_SCHEMA_PUSH === 'true' || !isProduction

export default buildConfig({
  admin: {
    user: Users.slug,
    // Custom admin CSS is imported by app/(payload)/layout.tsx (`./admin.css`),
    // which is the supported approach in Payload 3.90.
    meta: {
      titleSuffix: '- DriveIt',
    },
    components: {
      graphics: {
        Logo: '@/components/cms/Logo#Logo',
        Icon: '@/components/cms/Icon#Icon',
      },
      Nav: '@/components/cms/CustomNav#CustomNav',
      views: {
        dashboard: {
          Component: '@/components/cms/DashboardView#DashboardView',
        },
      },
    },
  },
  // Every collection gets cache revalidation on save so ISR pages stay fresh.
  collections: [
    withRevalidation(Users),
    withRevalidation(Customers),
    withRevalidation(Media),
    withRevalidation(Cars),
    withRevalidation(Blogs),
    withRevalidation(Services),
    withRevalidation(Testimonials),
    withRevalidation(Bookings),
    withRevalidation(Wishlists),
    withRevalidation(Coupons),
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  // Required for the Media collection's imageSizes/formatOptions (thumbnails,
  // AVIF/WebP conversion). Without it Payload silently skips resizing.
  sharp,
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'concierge@driveitluxury.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'DriveIt Luxury Concierge',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  // Fails loudly when unset instead of falling back to a publicly known secret.
  secret: requiredSecret('PAYLOAD_SECRET', 'driveit-dev-only-insecure-payload-secret'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres when DATABASE_URI is a postgres:// URL, SQLite otherwise.
  db: buildDatabaseAdapter({
    uri: process.env.DATABASE_URI || 'file:./driveit.db',
    push: pushSchema,
  }),
  onInit: async (payload) => {
    // One line at boot makes it obvious which database a deployment is on —
    // mixing them up is the classic way to "lose" content after a cutover.
    payload.logger.info(
      `[db] ${databaseDriver(process.env.DATABASE_URI || 'file:./driveit.db')} · ` +
        `${describeDatabase(process.env.DATABASE_URI || 'file:./driveit.db')} · ` +
        `${pushSchema ? 'schema push ENABLED' : 'migrations only'}`,
    )
  },
})
