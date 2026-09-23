import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'userEmail',
    defaultColumns: ['userEmail', 'carName', 'carSlug', 'createdAt'],
    description: '❤️ Saved cars. Written by the app after verifying the customer session (see app/api/wishlist).',
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'userEmail', type: 'text', required: true, index: true, label: 'Customer Email' },
    { name: 'carSlug', type: 'text', required: true, index: true, label: 'Saved Car Slug' },
    { name: 'carName', type: 'text', label: 'Car Name' },
  ],
}
