import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'role', 'company', 'isPublished'],
    description: '⭐ Client reviews shown in the homepage testimonial slider. Only publish real reviews.',
  },
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'author', type: 'text', required: true, label: 'Client Full Name' },
    { name: 'role', type: 'text', defaultValue: 'Verified Client', label: 'Client Role / Title' },
    { name: 'company', type: 'text', label: 'Company / City' },
    { name: 'content', type: 'textarea', required: true, label: 'Review Testimonial Text' },
    { name: 'rating', type: 'number', defaultValue: 5, min: 1, max: 5, label: 'Star Rating (1 to 5)' },
    { name: 'avatarSrc', type: 'text', label: 'Avatar Photo URL' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Display Order' },
    { name: 'isPublished', type: 'checkbox', defaultValue: true, index: true, label: 'Published' },
  ],
}
