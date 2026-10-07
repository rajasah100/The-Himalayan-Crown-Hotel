import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Guest Review', plural: 'Guest Reviews' },
  admin: {
    useAsTitle: 'guestName',
    defaultColumns: ['guestName', 'source', 'rating', 'isSample', 'published'],
    group: 'Guests',
    description: 'Only publish genuine reviews, copied with the guest’s consent or from a public review site.',
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'guestName', type: 'text', required: true },
        { name: 'origin', type: 'text', admin: { placeholder: 'London, United Kingdom' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'TripAdvisor', value: 'tripadvisor' },
            { label: 'Google', value: 'google' },
            { label: 'Booking.com', value: 'booking' },
            { label: 'Direct', value: 'direct' },
          ],
        },
        { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'stayDate', type: 'text', admin: { placeholder: 'March 2026' } },
      ],
    },
    {
      name: 'isSample',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Placeholder text — shown with a “Sample” label. Replace before launch.' },
    },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
