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
      defaultValue: '+91 63000 41186',
    },
    {
      name: 'contactEmail',
      type: 'text',
      label: 'Primary Email Address',
      defaultValue: 'concierge@driveitluxury.in',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Concierge Number',
      defaultValue: '+916300041186',
    },
    {
      name: 'promoBannerEnabled',
      type: 'checkbox',
      label: 'Enable Top Promo Announcement Banner',
      defaultValue: true,
    },
    {
      name: 'promoBannerText',
      type: 'text',
      label: 'Promo Banner Text',
      defaultValue: 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!',
    },
    {
      name: 'promoBannerCode',
      type: 'text',
      label: 'Promo Code Badge',
      defaultValue: 'FIRST10',
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
      name: 'favicon',
      type: 'relationship',
      relationTo: 'media',
      label: 'Website Favicon (.ico or .png)',
    },
    {
      name: 'appleTouchIcon',
      type: 'relationship',
      relationTo: 'media',
      label: 'Apple Touch Icon / PWA Icon (180x180 png)',
    },
    {
      name: 'headerVideoUrl',
      type: 'text',
      label: 'Homepage Header Video URL',
      admin: {
        description:
          'Optional. Direct .mp4 video URL to play as background on the homepage. Leave blank to use hero image.',
      },
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Hero Background Image (used when no video)',
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      label: 'Hero Tagline Subtitle',
      defaultValue: 'Premium Luxury Transportation',
    },
    {
      name: 'heroHeadingLine1',
      type: 'text',
      label: 'Hero Heading Line 1',
      defaultValue: 'The Art of',
    },
    {
      name: 'heroHeadingLine2',
      type: 'text',
      label: 'Hero Heading Line 2 (Gold Accent)',
      defaultValue: 'Luxury',
    },
    {
      name: 'missionBadge',
      type: 'text',
      label: 'Mission Section Badge',
      defaultValue: 'Who We Are',
    },
    {
      name: 'missionTitle',
      type: 'text',
      label: 'Mission Section Title',
      defaultValue: 'Our Mission',
    },
    {
      name: 'missionText',
      type: 'textarea',
      label: 'Mission Statement Body',
      defaultValue:
        'DRIVEIT Luxury aims to be the world’s leading luxury mobility platform, offering unmatched service, exclusivity, and innovation. We redefine ultra-luxury travel with cutting-edge technology, global partnerships, and personalized experiences—setting new standards in premium lifestyle and elite mobility.',
    },
    {
      name: 'missionImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Mission Background Image',
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Global SEO Meta Title',
      defaultValue: 'DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad | Book Online',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Global SEO Meta Description',
      defaultValue:
        'Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India. VIP chauffeur services, wedding cars, and corporate transportation solutions.',
    },
    {
      name: 'ogImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Social Share Preview Image (OG Image 1200x630)',
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
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn Page Link',
      defaultValue: 'https://linkedin.com/company/driveitluxury',
    },
    {
      name: 'twitterUrl',
      type: 'text',
      label: 'X (Twitter) Profile Link',
      defaultValue: 'https://twitter.com/driveitluxury',
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
