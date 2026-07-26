import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'author'],
    description: '📰 News & Articles: Articles edited here automatically appear on the Blog List (/blog) and Article Detail pages (/blog/[slug]).',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Article Title' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL Slug' },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Short Summary Excerpt' },
    { name: 'coverImage', type: 'relationship', relationTo: 'media', label: 'Article Cover Image' },
    { name: 'coverImageSrc', type: 'text', label: 'Static Image URL Fallback' },
    { name: 'author', type: 'text', defaultValue: 'DriveIt Editorial', label: 'Author Name' },
    { name: 'publishedDate', type: 'date', label: 'Publication Date' },
    { name: 'category', type: 'text', defaultValue: 'Luxury Travel', label: 'Category Tag' },
    { name: 'content', type: 'richText', label: 'Full Article Body' },
  ],
}
