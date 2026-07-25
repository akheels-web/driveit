import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'brand', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Sports', value: 'sports' },
        { label: 'MPV', value: 'mpv' },
        { label: 'Bus', value: 'bus' },
      ],
    },
    { name: 'price', type: 'number', required: true, label: 'Price per day (₹)' },
    { name: 'priceDisplay', type: 'text', label: 'Price Display (e.g. ₹8,000/day)' },
    { name: 'seats', type: 'number', required: true },
    {
      name: 'transmission',
      type: 'select',
      required: true,
      options: [
        { label: 'Automatic', value: 'Automatic' },
        { label: 'Manual', value: 'Manual' },
      ],
    },
    {
      name: 'fuel',
      type: 'select',
      required: true,
      options: [
        { label: 'Petrol', value: 'Petrol' },
        { label: 'Diesel', value: 'Diesel' },
        { label: 'Hybrid', value: 'Hybrid' },
        { label: 'Electric', value: 'Electric' },
      ],
    },
    {
      name: 'services',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Chauffeur', value: 'chauffeur' },
        { label: 'Self Drive', value: 'selfdrive' },
        { label: 'Airport Transfer', value: 'airport' },
      ],
    },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'imageSrc', type: 'text', label: 'Image Static Path (Fallback)' },
    { name: 'bootSpace', type: 'text', defaultValue: '450L' },
    { name: 'acZones', type: 'text', defaultValue: '4-Zone Climate Control' },
    { name: 'year', type: 'text', defaultValue: '2024' },
    { name: 'odometer', type: 'text', defaultValue: '15,000 km' },
    { name: 'cancellationPolicy', type: 'text', defaultValue: 'Free cancellation up to 48 hours before pickup.' },
    { name: 'kmAllowance', type: 'text', defaultValue: '100 km/day included.' },
    { name: 'securityDeposit', type: 'text', defaultValue: '₹25,000' },
  ],
}
