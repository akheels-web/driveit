import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'pricePerDay', 'isActive'],
    description:
      '🚗 Fleet catalogue: everything typed here drives the public fleet pages (/cars, /cars/[slug]) and checkout pricing.',
  },
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true, index: true, label: 'Car Name' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug (e.g. mercedes-s-class)',
      admin: { description: 'Used for /cars/[slug]. Keep it stable — it is the public URL and booking key.' },
    },
    { name: 'brand', type: 'text', required: true, defaultValue: 'Luxury', label: 'Brand' },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'sedan',
      index: true,
      options: [
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Sports', value: 'sports' },
        { label: 'MPV / Van', value: 'mpv' },
        { label: 'Bus', value: 'bus' },
        { label: 'Convertible', value: 'convertible' },
        { label: 'Wedding', value: 'wedding' },
      ],
    },
    {
      name: 'pricePerDay',
      type: 'number',
      required: true,
      min: 0,
      label: 'Rental Price Per Day (₹)',
      admin: { description: 'Checkout prices are always recomputed server-side from this value.' },
    },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Primary Image Asset' },
    { name: 'imageSrc', type: 'text', label: 'Static Image URL (fallback when no upload)' },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery Images',
      fields: [
        { name: 'image', type: 'relationship', relationTo: 'media', label: 'Gallery Image Asset' },
        { name: 'src', type: 'text', label: 'Image URL Fallback' },
      ],
    },
    {
      name: 'transmission',
      type: 'select',
      options: ['Automatic', 'Manual'],
      defaultValue: 'Automatic',
      label: 'Transmission',
    },
    {
      name: 'fuel',
      type: 'select',
      options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
      defaultValue: 'Petrol',
      label: 'Fuel Type',
    },
    { name: 'seats', type: 'number', defaultValue: 5, min: 1, label: 'Number of Seats' },
    {
      name: 'services',
      type: 'select',
      hasMany: true,
      defaultValue: ['chauffeur'],
      options: [
        { label: 'Chauffeur Driven', value: 'chauffeur' },
        { label: 'Self Drive', value: 'selfdrive' },
        { label: 'Airport Transfer', value: 'airport' },
      ],
      label: 'Available Service Types',
    },
    { name: 'description', type: 'textarea', label: 'Car Specifications & Features' },

    // Social proof — optional. Leave the counters at 0 to hide them in the UI
    // instead of showing invented numbers.
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
      label: 'Average Rating (0 = hidden)',
    },
    { name: 'reviewsCount', type: 'number', defaultValue: 0, min: 0, label: 'Number of Reviews' },
    { name: 'bookingsCount', type: 'number', defaultValue: 0, min: 0, label: 'Times Booked (display only)' },

    {
      name: 'specs',
      type: 'group',
      label: 'Detail Page Specs',
      fields: [
        { name: 'bootSpace', type: 'text', defaultValue: '450L', label: 'Boot Space' },
        { name: 'acZones', type: 'text', defaultValue: '4-Zone Climate Control', label: 'Climate Control' },
        { name: 'year', type: 'text', defaultValue: '2024', label: 'Model Year' },
        { name: 'odometer', type: 'text', defaultValue: '15,000 km', label: 'Odometer' },
      ],
    },
    {
      name: 'kmAllowance',
      type: 'text',
      defaultValue: '100 km/day included.',
      label: 'KM Allowance',
    },
    {
      name: 'securityDeposit',
      type: 'text',
      defaultValue: '₹25,000',
      label: 'Refundable Security Deposit (Display text)',
    },
    {
      name: 'securityDepositAmount',
      type: 'number',
      defaultValue: 25000,
      min: 0,
      label: 'Security Deposit Amount (₹)',
      admin: { description: 'Exact numeric deposit value used at checkout. Set to 0 if none.' },
    },
    {
      name: 'fuelPolicy',
      type: 'text',
      defaultValue: 'Full-to-Full (Return full tank, pay ₹0 fuel fee)',
      label: 'Fuel Policy',
    },
    {
      name: 'fastTagEquipped',
      type: 'checkbox',
      defaultValue: true,
      label: 'Electronic FASTag Equipped',
      admin: { description: 'Vehicle has an active electronic FASTag for automatic toll crossing.' },
    },
    {
      name: 'cancellationPolicy',
      type: 'textarea',
      defaultValue: 'Free cancellation up to 48 hours before pickup.',
      label: 'Cancellation Policy',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: { description: 'Lower numbers appear first in the fleet listing.' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Show on the website',
    },
  ],
}
