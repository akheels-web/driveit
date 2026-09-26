import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'firstTimeOnly', 'usageCount', 'usageLimit'],
    description:
      '🎟️ Discount coupons. Validation happens server-side in /api/coupons/validate — the browser never gets the coupon list.',
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Coupon Code (e.g. VIP20)',
      hooks: {
        beforeValidate: [
          ({ value, operation }) =>
            typeof value === 'string' && operation === 'create' ? value.trim().toUpperCase() : value,
        ],
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (₹)', value: 'fixed' },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      min: 0,
      label: 'Discount Value',
      admin: {
        description: 'If type is Percentage, 10 means 10%. If Fixed, 500 means ₹500 off.',
      },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true, index: true, label: 'Is Active?' },
    {
      name: 'firstTimeOnly',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: 'First-Time Customers Only?',
      admin: {
        description:
          'If enabled, only customers making their very first booking can use this coupon. Existing customers will receive an error.',
      },
    },
    {
      name: 'oncePerCustomer',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Limit 1 Use Per Customer?',
      admin: {
        description:
          'If enabled, the same customer cannot use this coupon code on multiple bookings.',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Valid Until (Expiration Date)',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'usageLimit',
      type: 'number',
      defaultValue: 1,
      min: 1,
      label: 'Maximum Usage Limit',
      admin: { description: 'Total global redemptions allowed across all customers. 1 = single-use coupon.' },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      label: 'Current Usage Count',
      admin: { readOnly: true },
    },
    {
      name: 'assignedCustomer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Assigned Customer Profile (Optional)',
      admin: {
        description:
          'Select a registered customer. If set, only this customer can redeem this voucher.',
      },
    },
    {
      name: 'customerEmail',
      type: 'text',
      index: true,
      label: 'Assigned Customer Email (Optional)',
      admin: { description: 'Alternatively, enter a customer email. Only this email address will be able to use the coupon.' },
    },
  ],
}
