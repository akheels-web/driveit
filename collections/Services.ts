import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'slug'],
    description: '🛠️ Chauffeur & Luxury Services: Editing services here updates the Services Catalog (/services) and Service Details pages (/services/[slug]).',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Service Name' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL Slug' },
    { name: 'shortDescription', type: 'textarea', required: true, label: 'Short Card Summary' },
    { name: 'fullDescription', type: 'richText', label: 'Detailed Description' },
    { name: 'price', type: 'text', label: 'Starting Price (e.g. ₹2,500/day)' },
    { name: 'icon', type: 'text', label: 'Icon Identifier' },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Service Banner Image' },
    { name: 'imageSrc', type: 'text', label: 'Static Image URL Fallback' },
  ],
}
