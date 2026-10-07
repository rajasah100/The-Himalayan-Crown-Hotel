import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'
import { slugField } from '../fields/slug'
import { videoField } from '../fields/video'

export const Dining: CollectionConfig = {
  slug: 'dining',
  labels: { singular: 'Restaurant / Bar', plural: 'Dining' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'cuisine', 'hours'], group: 'Content' },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    { name: 'cuisine', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    videoField('video'),
    { name: 'hours', type: 'text', admin: { placeholder: '7:00 AM – 10:30 PM' } },
    { name: 'dressCode', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
