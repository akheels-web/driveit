import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'
import { onBookingStatusChange } from '@/lib/loyalty'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'carName', 'totalPrice', 'status', 'startDate', 'createdAt'],
    description:
      '📋 Customer reservations. Customers create these through the secure checkout flow; you can review details, confirm payment and close bookings here.',
  },
  access: {
    // Customer-facing reads always go through server code that checks the
    // session email (see app/api/*). Direct API access stays staff-only.
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [onBookingStatusChange],
  },
  fields: [
    { name: 'customerName', type: 'text', required: true, label: 'Customer Full Name' },
    { name: 'customerEmail', type: 'text', required: true, index: true, label: 'Customer Email' },
    { name: 'customerPhone', type: 'text', required: true, label: 'Customer Phone Number' },
    { name: 'carName', type: 'text', required: true, label: 'Car Rented' },
    { name: 'carSlug', type: 'text', index: true, label: 'Car Slug' },
    { name: 'pickupLocation', type: 'text', label: 'Pickup Location Address' },
    { name: 'dropoffLocation', type: 'text', label: 'Dropoff Location Address' },
    { name: 'totalPrice', type: 'number', required: true, min: 0, label: 'Total Booking Amount (₹)' },
    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'chauffeur',
      index: true,
      options: [
        { label: 'Chauffeur Driven', value: 'chauffeur' },
        { label: 'Self Drive', value: 'selfdrive' },
        { label: 'Airport Transfer', value: 'airport' },
      ],
      label: 'Service Type',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending (hold)', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed / Closed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Booking Status',
    },
    {
      name: 'startDate',
      type: 'date',
      index: true,
      label: 'Booking Start Date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Booking End Date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'days', type: 'number', defaultValue: 1, min: 1, label: 'Rental Days' },
    {
      name: 'addons',
      type: 'text',
      label: 'Selected Add-ons / Bundle',
      admin: { description: 'Comma separated add-on ids selected at checkout.' },
    },
    { name: 'couponCode', type: 'text', label: 'Applied Coupon Code' },
    { name: 'discountApplied', type: 'number', label: 'Discount Applied (₹)', defaultValue: 0 },
    {
      name: 'holdExpiresAt',
      type: 'date',
      label: 'Hold Expiration Time',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Pending holds block the car for 10 minutes so two customers cannot book it at once.',
      },
    },
    {
      name: 'holdToken',
      type: 'text',
      index: true,
      label: 'Checkout Hold Token',
      admin: {
        readOnly: true,
        hidden: true,
        description: 'Random secret proving the person confirming payment is the person who created the hold.',
      },
    },
    { name: 'upiTransactionId', type: 'text', label: 'UPI / Payment Reference' },
    { name: 'whatsappNumber', type: 'text', label: 'WhatsApp Number' },
    { name: 'notes', type: 'textarea', label: 'Internal Notes' },
    {
      name: 'loyaltyRewardIssuedAt',
      type: 'date',
      label: 'Loyalty Reward Issued At',
      admin: { readOnly: true, description: 'Guards against issuing the same loyalty reward twice.' },
    },
  ],
}
