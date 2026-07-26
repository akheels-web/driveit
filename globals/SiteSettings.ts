import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings & Branding',
  access: {
    read: () => true,
    update: () => true,
  },
  admin: {
    description: '⚙️ Global Website Settings: Upload your Header Logo, Footer Logo, Contact Info, WhatsApp Number, and Social Links. Updating these fields automatically updates the Header nav bar and Footer across the entire website.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Website Title / Brand Name',
      defaultValue: 'DriveIt Luxury Transportation',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Primary Phone Number',
      defaultValue: '+91 98765 43210',
    },
    {
      name: 'contactEmail',
      type: 'text',
      label: 'Primary Email Address',
      defaultValue: 'concierge@driveitluxury.com',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Concierge Number',
      defaultValue: '+919876543210',
    },
    {
      name: 'headerLogo',
      type: 'relationship',
      relationTo: 'media',
      label: 'Header Logo Image',
    },
    {
      name: 'footerLogo',
      type: 'relationship',
      relationTo: 'media',
      label: 'Footer Logo Image',
    },
    {
      name: 'footerDescription',
      type: 'textarea',
      label: 'Footer Tagline / About Text',
      defaultValue: 'Premium luxury car rental and chauffeur services in Hyderabad. Experience unmatched comfort, elegance, and reliability.',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram Profile Link',
      defaultValue: 'https://instagram.com/driveitluxury',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook Page Link',
      defaultValue: 'https://facebook.com/driveitluxury',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Channel Link',
      defaultValue: 'https://youtube.com/@driveitluxury',
    },
  ],
}
