import type { CollectionConfig } from 'payload'

import { isStaff } from '../access'

// Public sign-ups go through the subscribe server action; the REST API is staff-only.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter Subscriber', plural: 'Newsletter' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'createdAt'], group: 'Guests' },
  access: { create: isStaff, read: isStaff, update: isStaff, delete: isStaff },
  fields: [{ name: 'email', type: 'email', required: true, unique: true, index: true }],
}
