import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'

/**
 * Customer records.
 *
 * Customers sign in with Google (Auth.js) — they are NOT Payload users, so this
 * collection is the single source of truth for their profile, saved addresses
 * and loyalty status. All customer-facing access happens in server code
 * (`app/api/profile`) which verifies the session first and then uses
 * `overrideAccess`, so direct API access stays staff-only.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'phone', 'loyaltyTier', 'loyaltyPoints', 'completedBookings'],
    description:
      '👤 Customer CRM: profiles, saved addresses and loyalty points for everyone who signed in with Google.',
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'email', type: 'text', required: true, unique: true, index: true, label: 'Email' },
    { name: 'name', type: 'text', label: 'Full Name' },
    { name: 'phone', type: 'text', label: 'Phone' },
    { name: 'homeAddress', type: 'text', label: 'Home Address' },
    { name: 'officeAddress', type: 'text', label: 'Office Address' },
    { name: 'airportAddress', type: 'text', label: 'Airport Preference' },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Loyalty Points',
      admin: { description: 'Awarded automatically: 100 points per ₹10,000 of completed bookings.' },
    },
    {
      name: 'loyaltyTier',
      type: 'select',
      defaultValue: 'silver',
      options: [
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
      ],
      label: 'Membership Tier',
      admin: { description: 'Gold at 1,000 points, Platinum at 5,000 points.' },
    },
    { name: 'completedBookings', type: 'number', defaultValue: 0, min: 0, label: 'Completed Bookings' },
    { name: 'totalSpent', type: 'number', defaultValue: 0, min: 0, label: 'Lifetime Value (₹)' },
  ],
}
