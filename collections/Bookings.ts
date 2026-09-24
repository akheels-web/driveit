import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'
import { onBookingStatusChange, stampBookingTransitions } from '@/lib/loyalty'
import { AWAITING_VERIFICATION, PAYMENT_STATUS_OPTIONS, stampPaymentVerification } from '@/lib/payments'
import { onBookingEmailNotifications, stampBookingEmailGuards } from '@/lib/booking-email-hooks'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: [
      'customerName',
      'carName',
      'totalPrice',
      'paymentStatus',
      'status',
      'startDate',
      'createdAt',
    ],
    description:
      '📋 Customer reservations. Customers create these through the secure checkout flow; check the UPI reference against the account, then mark the payment verified.',
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
    // Data-only stamping happens in the same write (see lib/loyalty.ts for why a
    // nested same-row update deadlocks on Postgres).
    beforeChange: [stampBookingTransitions, stampPaymentVerification, stampBookingEmailGuards],
    afterChange: [onBookingStatusChange, onBookingEmailNotifications],
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
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: AWAITING_VERIFICATION,
      index: true,
      options: [...PAYMENT_STATUS_OPTIONS],
      label: 'Payment Verification',
      admin: {
        description:
          'The UPI reference is typed in by the customer. Confirm it against the account, then set this to Verified — nothing else in the system claims the money arrived.',
      },
    },
    {
      name: 'paymentVerifiedAt',
      type: 'date',
      label: 'Payment Verified At',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Stamped automatically when the payment status is set to Verified.',
      },
    },
    {
      name: 'paymentVerifiedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Payment Verified By',
      admin: { readOnly: true, description: 'Which staff account verified the payment.' },
    },
    { name: 'whatsappNumber', type: 'text', label: 'WhatsApp Number' },
    { name: 'notes', type: 'textarea', label: 'Internal Notes' },
    {
      name: 'loyaltyRewardIssuedAt',
      type: 'date',
      label: 'Loyalty Reward Issued At',
      admin: { readOnly: true, description: 'Guards against issuing the same loyalty reward twice.' },
    },
    {
      name: 'pickupReminderSentAt',
      type: 'date',
      label: 'Pickup Reminder Sent At',
      admin: { readOnly: true, description: 'Stamped when 24h pickup reminder email is sent.' },
    },
    {
      name: 'returnReminderSentAt',
      type: 'date',
      label: 'Return Reminder Sent At',
      admin: { readOnly: true, description: 'Stamped when 2h return reminder email is sent.' },
    },
    {
      name: 'paymentReceiptSentAt',
      type: 'date',
      label: 'Payment Receipt Sent At',
      admin: { readOnly: true, description: 'Stamped when payment verified receipt email is sent.' },
    },
    {
      name: 'cancellationNotifiedAt',
      type: 'date',
      label: 'Cancellation Notified At',
      admin: { readOnly: true, description: 'Stamped when cancellation email is sent.' },
    },
    {
      name: 'reviewRequestedAt',
      type: 'date',
      label: 'Review Requested At',
      admin: { readOnly: true, description: 'Stamped when trip completed review email is sent.' },
    },
  ],
}
