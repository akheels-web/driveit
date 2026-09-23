import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/lib/access'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'usageCount', 'usageLimit'],
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
      admin: { description: 'Total redemptions allowed. 1 = single-use loyalty coupon.' },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      label: 'Current Usage Count',
      admin: { readOnly: true },
    },
    {
      name: 'customerEmail',
      type: 'text',
      index: true,
      label: 'Assigned Customer Email (Optional)',
      admin: { description: 'If filled, only this email address can use the coupon.' },
    },
  ],
}
