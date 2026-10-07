import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'
import { slugField } from '../fields/slug'
import { videoField } from '../fields/video'

export const RoomTypes: CollectionConfig = {
  slug: 'room-types',
  labels: { singular: 'Room / Suite', plural: 'Rooms & Suites' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'baseRateUSD', 'totalRooms', 'featured'],
    group: 'Content',
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'room',
          options: [
            { label: 'Room', value: 'room' },
            { label: 'Suite', value: 'suite' },
            { label: 'Villa', value: 'villa' },
          ],
        },
      ],
    },
    slugField(),
    { name: 'tagline', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    videoField('video', 'Short muted clip: plays on hover in the home showcase and behind the room page hero.'),
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      type: 'collapsible',
      label: 'Room details',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'sizeSqm', type: 'number', label: 'Size (m²)' },
            { name: 'maxAdults', type: 'number', defaultValue: 2, required: true },
            { name: 'maxChildren', type: 'number', defaultValue: 1 },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'bed', type: 'text', admin: { placeholder: 'King / Twin' } },
            { name: 'view', type: 'text', admin: { placeholder: 'Himalayan view' } },
          ],
        },
        { name: 'amenities', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
      ],
    },
    {
      type: 'collapsible',
      label: 'Inventory & pricing',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'baseRateUSD', type: 'number', required: true, min: 0, label: 'Base rate (USD / night)' },
            { name: 'baseRateNPR', type: 'number', min: 0, label: 'Base rate (NPR / night)' },
            {
              name: 'totalRooms',
              type: 'number',
              required: true,
              min: 0,
              defaultValue: 1,
              admin: { description: 'Number of physical rooms of this type sold on the website.' },
            },
          ],
        },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
