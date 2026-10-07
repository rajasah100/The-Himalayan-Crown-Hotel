import type { Field } from 'payload'

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: `Auto-generated from "${from}" if left empty.` },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
