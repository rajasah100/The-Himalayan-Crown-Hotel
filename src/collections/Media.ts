import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'

export const GALLERY_CATEGORIES = [
  { label: 'The Hotel', value: 'hotel' },
  { label: 'Rooms & Suites', value: 'rooms' },
  { label: 'Dining', value: 'dining' },
  { label: 'Weddings & Events', value: 'weddings' },
  { label: 'Spa & Wellness', value: 'wellness' },
  { label: 'Nepal', value: 'nepal' },
] as const

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  hooks: revalidateHooks,
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'galleryCategory',
      type: 'select',
      index: true,
      admin: { position: 'sidebar', description: 'Set a category to show this file on the public Gallery page.' },
      options: [...GALLERY_CATEGORIES],
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 1080 },
      { name: 'hero', width: 2400 },
    ],
  },
}
