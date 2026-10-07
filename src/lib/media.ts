import type { Media } from '@/payload-types'

type Size = 'thumb' | 'card' | 'hero'

export const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in value

export function mediaUrl(value: unknown, size?: Size): string | null {
  if (!isMedia(value)) return null
  const sized = size ? value.sizes?.[size]?.url : null
  return sized || value.url || null
}

export const mediaAlt = (value: unknown, fallback = '') => (isMedia(value) ? value.alt : fallback)
