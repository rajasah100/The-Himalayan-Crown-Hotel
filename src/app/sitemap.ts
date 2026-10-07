import type { MetadataRoute } from 'next'

import { getRoomTypes } from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getRoomTypes()
  const pages = ['', '/rooms', '/dining', '/menu', '/experiences', '/weddings', '/gallery', '/offers', '/contact']
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.8 })),
    ...rooms.map((r) => ({ url: `${SITE_URL}/rooms/${r.slug}`, lastModified: r.updatedAt, priority: 0.7 })),
  ]
}
