import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'isPublished'],
    description:
      '📰 Journal articles: published posts appear on /blog and /blog/[slug]. Drafts stay hidden from the website.',
  },
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, index: true, label: 'Article Title' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'URL Slug' },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Short Summary Excerpt' },
    { name: 'coverImage', type: 'relationship', relationTo: 'media', label: 'Article Cover Image' },
    { name: 'coverImageSrc', type: 'text', label: 'Static Image URL Fallback' },
    { name: 'author', type: 'text', defaultValue: 'DriveIt Editorial', label: 'Author Name' },
    { name: 'publishedDate', type: 'date', label: 'Publication Date' },
    { name: 'category', type: 'text', defaultValue: 'Luxury Travel', label: 'Category Tag' },
    { name: 'readTimeMinutes', type: 'number', defaultValue: 5, min: 1, label: 'Read Time (minutes)' },
    { name: 'content', type: 'richText', label: 'Full Article Body' },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Published',
    },
  ],
}
