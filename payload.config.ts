import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
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
import { buildDatabaseAdapter, databaseUri, describeDatabase } from './lib/db'
import { cloudinaryAdapter, cloudinarySettings } from './lib/cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Migrations are the single source of truth (`npm run migrate`), in every
// environment. Auto-push is opt-in via PAYLOAD_SCHEMA_PUSH=true and exists only
// to bootstrap a throwaway database — leaving it on in development is what makes
// a local schema quietly differ from the one staging and production migrate to.
const pushSchema = process.env.PAYLOAD_SCHEMA_PUSH === 'true'

// Resolved once at boot; throws when DATABASE_URI is missing or not Postgres.
const dbUri = databaseUri()

// Media storage: Cloudinary when its three credentials are present, local disk
// otherwise (development, and the build phase where runtime secrets are absent).
// `alwaysInsertFields` keeps the schema identical in both modes, so switching a
// deployment to Cloudinary is an env change and a restart — not a migration.
const cloudinary = cloudinarySettings()

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
  plugins: [
    cloudStoragePlugin({
      enabled: cloudinary !== null,
      alwaysInsertFields: true,
      collections: {
        media: {
          adapter: cloudinaryAdapter(),
          // Local copies are pointless once the CDN serves the file, and worse
          // than pointless with more than one replica (each container would
          // have its own, divergent `public/media`).
          disableLocalStorage: cloudinary !== null,
          ...(cloudinary ? { disablePayloadAccessControl: true as const } : {}),
        },
      },
    }),
  ],
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
  // Postgres only — `databaseUri()` throws rather than falling back to a local
  // file, so a misconfigured deploy fails loudly instead of starting empty.
  db: buildDatabaseAdapter({ uri: dbUri, push: pushSchema }),
  onInit: async (payload) => {
    // One line at boot makes it obvious which database a deployment is on —
    // mixing up staging and production is the classic way to "lose" content.
    payload.logger.info(
      `[db] postgres · ${describeDatabase(dbUri)} · ` +
        `${pushSchema ? 'schema push ENABLED' : 'migrations only'}`,
    )
    payload.logger.info(
      cloudinary
        ? `[media] cloudinary · ${cloudinary.cloudName} · folder "${cloudinary.folder}"`
        : '[media] local disk (public/media) — set CLOUDINARY_* to serve uploads from the CDN',
    )
  },
})
