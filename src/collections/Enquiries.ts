import type { CollectionConfig } from 'payload'

import { isStaff } from '../access'

// Public submissions go through the /api/enquiries/submit route (validated + rate-limited later),
// so the REST create endpoint is staff-only.
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'email', 'status', 'createdAt'],
    group: 'Guests',
  },
  access: { create: isStaff, read: isStaff, update: isStaff, delete: isStaff },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Wedding', value: 'wedding' },
        { label: 'Meeting / Event', value: 'event' },
        { label: 'Dining reservation', value: 'dining' },
        { label: 'Spa', value: 'spa' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'preferredDate', type: 'date' },
    { name: 'guests', type: 'number', min: 1 },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
