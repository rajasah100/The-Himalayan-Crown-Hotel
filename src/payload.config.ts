import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Bookings } from './collections/Bookings'
import { Dining } from './collections/Dining'
import { Dishes } from './collections/Dishes'
import { Enquiries } from './collections/Enquiries'
import { EventVenues } from './collections/EventVenues'
import { Experiences } from './collections/Experiences'
import { Media } from './collections/Media'
import { Offers } from './collections/Offers'
import { RoomTypes } from './collections/RoomTypes'
import { Subscribers } from './collections/Subscribers'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { cloudinaryAdapter, cloudinaryEnabled } from './lib/cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · The Himalayan Crown' },
    components: {
      graphics: {
        Logo: '/components/admin/Graphics#Logo',
        Icon: '/components/admin/Graphics#Icon',
      },
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [RoomTypes, Dining, Dishes, Experiences, EventVenues, Offers, Media, Bookings, Enquiries, Testimonials, Subscribers, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev auto-syncs the schema; production (and DB_PUSH=false, e.g. seeding a remote DB) uses migrations only.
    push: process.env.NODE_ENV !== 'production' && process.env.DB_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Media goes to Cloudinary when CLOUDINARY_* env vars are set; otherwise it stays on local disk (./media).
    cloudStoragePlugin({
      enabled: cloudinaryEnabled,
      // Keep the schema identical with or without Cloudinary keys, so migrations never drift.
      alwaysInsertFields: true,
      collections: {
        media: { adapter: cloudinaryAdapter, disableLocalStorage: true, disablePayloadAccessControl: true },
      },
    }),
  ],
})
