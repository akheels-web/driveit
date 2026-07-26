import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'transmission', 'fuel'],
    description: '🚗 Fleet Catalog: Click any car below to edit pricing, photos, or features. Click "+ Create New" to add a new luxury car to your website.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Car Name' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL Slug (e.g. mercedes-s-class)' },
    { name: 'category', type: 'text', required: true, label: 'Category (Luxury, Sports, SUV, Wedding)' },
    { name: 'price', type: 'number', required: true, label: 'Rental Price Per Day (₹)' },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Primary Image Asset' },
    { name: 'imageSrc', type: 'text', label: 'Static Image URL Fallback' },
    { name: 'transmission', type: 'select', options: ['Automatic', 'Manual'], defaultValue: 'Automatic', label: 'Transmission' },
    { name: 'fuel', type: 'select', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], defaultValue: 'Petrol', label: 'Fuel Type' },
    { name: 'seats', type: 'number', defaultValue: 5, label: 'Number of Seats' },
    { name: 'description', type: 'textarea', label: 'Car Specifications & Features' },
  ],
}
