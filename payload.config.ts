import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cars } from './collections/Cars'
import { Blogs } from './collections/Blogs'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Bookings } from './collections/Bookings'
import { Wishlists } from './collections/Wishlists'
import { Coupons } from './collections/Coupons'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(dirname, 'app/(payload)/admin.css'),
    components: {
      Nav: '@/components/cms/CustomNav#CustomNav',
      views: {
        dashboard: {
          Component: '@/components/cms/DashboardView#DashboardView',
        },
      },
    },
  },
  collections: [Users, Media, Cars, Blogs, Services, Testimonials, Bookings, Wishlists, Coupons],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: 'concierge@yourdomain.com', // Replace with verified Resend domain
        defaultFromName: 'DriveIt Luxury Concierge',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || 'DRIVEIT_PAYLOAD_SECRET_LOCAL_HOST_12345',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./driveit.db',
    },
    push: true, // Automatically synchronize schema changes for new collections
  }),
})
