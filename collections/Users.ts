import type { CollectionConfig } from 'payload'

import { adminFieldOnly, adminOnly, adminOrSelf, isAdminUser } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // lock for 15 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
    description:
      '👑 Staff accounts: admins manage everything; editors can manage content but not users, roles or site settings.',
  },
  access: {
    // Staff may only read themselves unless they are an admin.
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
    // Only admins can see/manage the roles of other users.
    admin: ({ req: { user } }) => isAdminUser(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin — full access', value: 'admin' },
        { label: 'Editor — content only', value: 'editor' },
      ],
      // Only an admin can promote/demote somebody (prevents privilege escalation).
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      saveToJWT: true,
      admin: {
        description: 'Editors cannot manage users, coupons or global site settings.',
      },
    },
  ],
}
