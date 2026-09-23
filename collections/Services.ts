import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'isPublished'],
    description: '🛠️ Chauffeur & luxury service catalogue used by the /services pages and the homepage.',
  },
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Service Name' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'URL Slug' },
    { name: 'shortDescription', type: 'textarea', required: true, label: 'Short Card Summary' },
    { name: 'fullDescription', type: 'richText', label: 'Detailed Description' },
    { name: 'price', type: 'text', label: 'Starting Price (e.g. ₹2,500/day)' },
    { name: 'icon', type: 'text', label: 'Icon Identifier' },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Service Banner Image' },
    { name: 'imageSrc', type: 'text', label: 'Static Image URL Fallback' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Display Order' },
    { name: 'isPublished', type: 'checkbox', defaultValue: true, index: true, label: 'Published' },
  ],
}
