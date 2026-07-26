import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'role', 'company'],
    description: '⭐ Client Reviews: Editing reviews here automatically updates the Testimonials Slider on Homepage (/) and About Us (/about).',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'author', type: 'text', required: true, label: 'Client Full Name' },
    { name: 'role', type: 'text', defaultValue: 'Verified Client', label: 'Client Role / Title' },
    { name: 'company', type: 'text', label: 'Company / City' },
    { name: 'content', type: 'textarea', required: true, label: 'Review Testimonial Text' },
    { name: 'rating', type: 'number', defaultValue: 5, label: 'Star Rating (1 to 5)' },
    { name: 'avatarSrc', type: 'text', label: 'Avatar Photo URL' },
  ],
}
