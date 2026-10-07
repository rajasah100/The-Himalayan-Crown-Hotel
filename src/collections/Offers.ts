import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'
import { slugField } from '../fields/slug'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'validTo', 'active'], group: 'Content' },
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'validFrom', type: 'date' },
        { name: 'validTo', type: 'date' },
        { name: 'discountPercent', type: 'number', min: 0, max: 100 },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
