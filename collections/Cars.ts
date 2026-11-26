import type { CollectionConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'pricePerDay', 'selfDrivePricePerDay', 'isActive'],
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
      label: 'Chauffeur Rental Price Per Day (With Driver) (₹)',
      admin: {
        description:
          'Daily rental price with a professional uniformed chauffeur included. Used when "With Driver" is selected.',
      },
    },
    {
      name: 'selfDrivePricePerDay',
      type: 'number',
      min: 0,
      label: 'Self-Drive Price Per Day (Without Driver) (₹)',
      admin: {
        description:
          'Daily rental price when customer drives themselves (without driver). If left empty, defaults to 85% of with-driver price.',
      },
    },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Primary Image Asset' },
    { name: 'imageSrc', type: 'text', label: 'Static Image URL (fallback when no upload)' },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Primary Image Alt Text (SEO)',
      admin: {
        description:
          'Accessible alt text for primary vehicle image. Leave blank to auto-generate non-duplicated Brand + Model alt.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery Images',
      fields: [
        { name: 'image', type: 'relationship', relationTo: 'media', label: 'Gallery Image Asset' },
        { name: 'src', type: 'text', label: 'Image URL Fallback' },
        { name: 'alt', type: 'text', label: 'Gallery Image Alt Text' },
      ],
    },
    {
      name: 'featuredInStudioStage',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature in Homepage Interactive Studio Stage',
      admin: {
        description: 'Check to display this vehicle inside the Interactive Garage Studio Stage on /.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Studio Stage Tagline',
      admin: { description: 'E.g. "Architecture of Luxury · Starlight Headliner"' },
    },
    {
      type: 'row',
      fields: [
        { name: 'powerHp', type: 'number', min: 0, label: 'Power Output (BHP)', admin: { width: '33%' } },
        { name: 'zeroToHundred', type: 'text', label: '0–100 km/h Time', admin: { width: '33%' } },
        { name: 'topSpeed', type: 'text', label: 'Top Speed', admin: { width: '34%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'acousticNote',
          type: 'text',
          label: 'Cabin Acoustic / Exhaust Signature',
          admin: { width: '60%' },
        },
        {
          name: 'engineAudioProfile',
          type: 'select',
          label: 'Engine Audio Profile',
          defaultValue: 'v12-whisper',
          options: [
            { label: 'Rolls-Royce V12 Whisper Turbine', value: 'v12-whisper' },
            { label: 'Aston Martin Twin-Turbo V8', value: 'v8-twinturbo' },
            { label: 'Ferrari SF90 Hybrid Flat-Plane V8', value: 'v8-hybrid' },
            { label: 'Mercedes-AMG G 63 Bi-Turbo V8', value: 'v8-amg' },
            { label: 'Lamborghini Huracán NA V10', value: 'v10-screamer' },
          ],
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'studioHotspots',
      type: 'array',
      label: 'Interactive Studio Stage Hotspots',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Hotspot Label' },
        { name: 'specBadge', type: 'text', label: 'Powertrain / Feature Badge' },
        { name: 'detail', type: 'textarea', label: 'Engineering Detail' },
        {
          type: 'row',
          fields: [
            { name: 'x', type: 'number', min: 0, max: 100, defaultValue: 50, label: 'Pin X (%)', admin: { width: '50%' } },
            { name: 'y', type: 'number', min: 0, max: 100, defaultValue: 50, label: 'Pin Y (%)', admin: { width: '50%' } },
          ],
        },
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
    // GPS Tracker & Telematics
    {
      name: 'gpsDeviceId',
      type: 'text',
      index: true,
      label: 'GPS Device IMEI / Tracker ID',
      admin: {
        description: 'Unique IMEI or tracker ID of the Indian SIM GPS unit installed in this vehicle.',
      },
    },
    {
      name: 'currentOdometerKm',
      type: 'number',
      defaultValue: 15000,
      min: 0,
      label: 'Current Cumulative Odometer (km)',
      admin: {
        description: 'Updated automatically via GPS SIM tracker pings or CAN-bus OBD telemetry.',
      },
    },
    {
      name: 'extraKmRate',
      type: 'number',
      defaultValue: 75,
      min: 0,
      label: 'Extra KM Charge Rate (₹ / km)',
      admin: {
        description: 'Billed per km when customer exceeds daily 100km allowance (e.g. ₹50 for sedans, ₹100 for luxury SUVs).',
      },
    },
    {
      name: 'currentTelemetry',
      type: 'group',
      label: 'Live Telematics & GPS Snapshot',
      fields: [
        { name: 'latitude', type: 'number', label: 'Latitude' },
        { name: 'longitude', type: 'number', label: 'Longitude' },
        { name: 'speedKmH', type: 'number', label: 'Speed (km/h)' },
        { name: 'ignition', type: 'checkbox', label: 'Engine Ignition ON' },
        { name: 'batteryVoltage', type: 'number', label: 'Battery Voltage (V)' },
        { name: 'lastPingAt', type: 'date', label: 'Last Ping Timestamp' },
        {
          name: 'geofenceStatus',
          type: 'select',
          defaultValue: 'inside_hyderabad',
          options: [
            { label: 'Inside Hyderabad Outer Ring Road (Authorized)', value: 'inside_hyderabad' },
            { label: 'Outstation Zone (Alert/Verified)', value: 'outstation_zone' },
            { label: 'Geofence Breach', value: 'geofence_breach' },
          ],
          label: 'Geofence Security Status',
        },
        { name: 'lastAlert', type: 'text', label: 'Latest Telematics Alert' },
      ],
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
