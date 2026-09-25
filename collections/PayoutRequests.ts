import type { CollectionConfig } from 'payload'
import { adminOnly, staffOnly } from '@/lib/access'

export const PayoutRequests: CollectionConfig = {
  slug: 'payout-requests',
  admin: {
    useAsTitle: 'partnerEmail',
    defaultColumns: ['partnerEmail', 'amount', 'status', 'bankUtr', 'createdAt'],
    description: '💰 Payout requests and transaction logs for fleet consignment partners.',
  },
  access: {
    read: adminOnly,
    create: staffOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'partnerEmail', type: 'text', required: true, label: 'Partner Email' },
    { name: 'amount', type: 'number', required: true, min: 0, label: 'Requested Payout (₹)' },
    { name: 'periodSummary', type: 'text', label: 'Billing Period (e.g. Sep 1 - Sep 30)' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Accounting Verification', value: 'pending' },
        { label: 'Dispatched & Settled', value: 'dispatched' },
        { label: 'Rejected', value: 'rejected' },
      ],
      label: 'Payout Status',
    },
    { name: 'bankUtr', type: 'text', label: 'Bank Transfer UTR Reference' },
    { name: 'dispatchedAt', type: 'date', label: 'Dispatched At' },
    { name: 'notes', type: 'textarea', label: 'Accounting Notes' },
  ],
}
