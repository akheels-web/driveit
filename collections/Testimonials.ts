import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', defaultValue: 'Verified Client' },
    { name: 'rating', type: 'number', defaultValue: 5, min: 1, max: 5 },
    { name: 'content', type: 'textarea', required: true },
    { name: 'carRented', type: 'text' },
  ],
}
