import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { slugField } from '../fields/slug'
import { videoField } from '../fields/video'
import { revalidateHooks } from '../hooks/revalidateSite'

export const EventVenues: CollectionConfig = {
  slug: 'event-venues',
  labels: { singular: 'Event Venue', plural: 'Event Venues' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'setting', 'banquet', 'theatre'],
    group: 'Content',
    description: 'Ballrooms, courtyards and lawns shown on the Weddings page.',
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
          name: 'setting',
          type: 'select',
          required: true,
          defaultValue: 'indoor',
          options: [
            { label: 'Indoor', value: 'indoor' },
            { label: 'Outdoor', value: 'outdoor' },
            { label: 'Indoor & outdoor', value: 'both' },
          ],
        },
      ],
    },
    slugField(),
    { name: 'summary', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        videoField('video'),
      ],
    },
    {
      type: 'collapsible',
      label: 'Capacity',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'areaSqm', type: 'number', label: 'Area (m²)' },
            { name: 'banquet', type: 'number', label: 'Banquet' },
            { name: 'theatre', type: 'number', label: 'Theatre' },
            { name: 'reception', type: 'number', label: 'Cocktail reception' },
          ],
        },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
