import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
    description: '🖼️ Media library: upload car photos, logos and banners here, then attach them to any content.',
  },
  access: {
    // Staff-only read access on the REST API. Public site renders images directly
    // from Cloudinary CDN or /public/media static routing. Customer KYC documents
    // (driving licenses, ID proofs) are strictly protected and never queryable by customers or public.
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text / Description',
    },
  ],
}
