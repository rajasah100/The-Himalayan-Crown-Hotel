import type { CollectionConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { revalidateHooks } from '../hooks/revalidateSite'

export const DISH_CATEGORIES = [
  { label: 'Newari Specialities', value: 'newari' },
  { label: 'Momo', value: 'momo' },
  { label: 'Nepali Classics', value: 'nepali' },
  { label: 'Himalayan Grill', value: 'grill' },
  { label: 'International', value: 'international' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Drinks', value: 'drinks' },
] as const

export const DISH_TAGS = [
  { label: 'Chef’s signature', value: 'signature' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Spicy', value: 'spicy' },
  { label: 'Gluten free', value: 'gluten-free' },
] as const

export const Dishes: CollectionConfig = {
  slug: 'dishes',
  labels: { singular: 'Dish', plural: 'Menu' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priceNPR', 'restaurant', 'available'],
    group: 'Content',
    description: 'Dishes shown on the public /menu page.',
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: { read: anyone, create: canManageContent, update: canManageContent, delete: canManageContent },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'localName', type: 'text', admin: { description: 'Name in Nepali / Newari, e.g. मःमः' } },
      ],
    },
    { name: 'description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', required: true, options: [...DISH_CATEGORIES] },
        { name: 'priceNPR', type: 'number', required: true, min: 0, label: 'Price (NPR)' },
        { name: 'restaurant', type: 'relationship', relationTo: 'dining' },
      ],
    },
    { name: 'tags', type: 'select', hasMany: true, options: [...DISH_TAGS] },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional — dishes with a photo are featured larger.' } },
    { name: 'available', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
