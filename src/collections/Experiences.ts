import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { slugField } from '../fields/slug'
import { videoField } from '../fields/video'
import { revalidateHooks } from '../hooks/revalidateSite'

export const EXPERIENCE_CATEGORIES = [
  { label: 'Culture & Heritage', value: 'culture' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Spa & Wellness', value: 'wellness' },
] as const

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'priceFrom', 'featured'],
    group: 'Content',
    description: 'Tours, adventures and spa rituals shown on /experiences and the home page.',
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', required: true, options: [...EXPERIENCE_CATEGORIES] },
        { name: 'duration', type: 'text', admin: { placeholder: 'Half day' } },
        { name: 'priceFrom', type: 'text', admin: { placeholder: 'From USD 120 per person' } },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }, videoField('video')],
    },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the home page.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
