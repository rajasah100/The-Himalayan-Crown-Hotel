import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isStaff } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Settings',
  },
  auth: true,
  access: {
    read: isStaff,
    create: isAdmin,
    update: ({ req: { user }, id }) => Boolean(user && (user.roles?.includes('admin') || user.id === id)),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['admin'],
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Reservations', value: 'reservations' },
        { label: 'Content Editor', value: 'editor' },
      ],
    },
  ],
}
