import type { GlobalConfig } from 'payload'

import { adminOnly, anyone } from '@/lib/access'
import { revalidateAfterGlobalChange } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings & Branding',
  access: {
    read: anyone,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterGlobalChange],
  },
  admin: {
    description:
      '⚙️ Global branding and contact details. Saving here refreshes the homepage cache automatically.',
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
      name: 'headerVideoUrl',
      type: 'text',
      label: 'Homepage Header Video URL',
      admin: {
        description:
          'Optional. Paste a direct .mp4 video URL to play a video background on the homepage instead of the static image. Leave blank to use the default image.',
      },
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
      defaultValue:
        'Premium luxury car rental and chauffeur services in Hyderabad. Experience unmatched comfort, elegance, and reliability.',
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
    {
      name: 'address',
      type: 'text',
      label: 'Business Address',
      defaultValue: 'Banjara Hills, Hyderabad, Telangana 500034',
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
      admin: { description: 'The src of the iframe shown in the “Visit Our Location” section.' },
    },
    {
      name: 'mapLink',
      type: 'text',
      label: 'Google Maps Share Link',
      admin: { description: 'Opened by the “Open in Maps” button.' },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Homepage Counters',
      labels: { singular: 'Counter', plural: 'Counters' },
      admin: { description: 'Leave empty to use the built-in defaults.' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Label (e.g. Luxury Cars)' },
        { name: 'value', type: 'number', required: true, label: 'Number to count up to' },
        { name: 'suffix', type: 'text', label: 'Suffix (e.g. + or /7)' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'Homepage FAQs',
      labels: { singular: 'FAQ', plural: 'FAQs' },
      admin: {
        description:
          'Leave empty to use the built-in defaults. These also feed the FAQ structured data for Google.',
      },
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Question' },
        { name: 'answer', type: 'textarea', required: true, label: 'Answer' },
      ],
    },
  ],
}
