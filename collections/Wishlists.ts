import type { CollectionConfig } from 'payload'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'userEmail',
    defaultColumns: ['userEmail', 'carSlug', 'createdAt'],
    description: '❤️ Customer Saved Cars: Wishlist records saved by logged-in customers appear here.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'userEmail', type: 'text', required: true, label: 'Customer Email' },
    { name: 'carSlug', type: 'text', required: true, label: 'Saved Car Slug' },
  ],
}
