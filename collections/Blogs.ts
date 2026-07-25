import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'coverImage', type: 'relationship', relationTo: 'media' },
    { name: 'coverImageSrc', type: 'text', label: 'Static Image URL Fallback' },
    { name: 'author', type: 'text', defaultValue: 'DriveIt Editorial' },
    { name: 'publishedDate', type: 'date' },
    { name: 'category', type: 'text', defaultValue: 'Luxury Travel' },
    { name: 'content', type: 'richText' },
  ],
}
