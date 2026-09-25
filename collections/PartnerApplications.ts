import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '@/lib/access'

export const PartnerApplications: CollectionConfig = {
  slug: 'partner-applications',
  admin: {
    useAsTitle: 'vehicleName',
    defaultColumns: ['vehicleName', 'ownerName', 'ownerPhone', 'city', 'status', 'createdAt'],
    description: '🤝 Luxury fleet consignment applications submitted by car owners and fleet partners.',
  },
  access: {
    read: adminOnly,
    create: anyone, // public submission via /partner/list-fleet
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'ownerName', type: 'text', required: true, label: 'Owner / Company Name' },
    { name: 'ownerEmail', type: 'text', required: true, label: 'Owner Email' },
    { name: 'ownerPhone', type: 'text', required: true, label: 'Owner Phone Number' },
    { name: 'city', type: 'text', required: true, defaultValue: 'Hyderabad', label: 'Vehicle City' },
    { name: 'vehicleName', type: 'text', required: true, label: 'Vehicle (Make & Model)' },
    { name: 'manufacturingYear', type: 'number', required: true, label: 'Manufacturing Year' },
    { name: 'registrationNumber', type: 'text', required: true, label: 'Registration Plate Number' },
    { name: 'odometerKm', type: 'number', label: 'Current Odometer (km)' },
    { name: 'expectedMonthlyRevenue', type: 'text', label: 'Expected Monthly Return / Revenue Share' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending_inspection',
      options: [
        { label: 'Pending Inspection', value: 'pending_inspection' },
        { label: 'Inspection Scheduled', value: 'inspection_scheduled' },
        { label: 'Approved & Listed in Fleet', value: 'approved' },
        { label: 'Declined', value: 'declined' },
      ],
      label: 'Application Status',
    },
    { name: 'adminNotes', type: 'textarea', label: 'Internal Staff Notes' },
  ],
}
