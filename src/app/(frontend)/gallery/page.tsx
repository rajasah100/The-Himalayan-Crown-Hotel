import type { Metadata } from 'next'

import { GALLERY_CATEGORIES } from '@/collections/Media'
import { type GalleryItem, GalleryGrid } from '@/components/gallery/GalleryGrid'
import { PageHero } from '@/components/layout/PageHero'
import { mediaUrl } from '@/lib/media'
import { getGalleryMedia, getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photographs and films of our rooms, restaurants, weddings, spa and the Kathmandu valley.',
}

type Props = { searchParams: Promise<{ c?: string }> }

export default async function GalleryPage({ searchParams }: Props) {
  const { c } = await searchParams
  const [media, settings] = await Promise.all([getGalleryMedia(), getSiteSettings()])

  const items: GalleryItem[] = media
    .filter((m) => m.url && m.galleryCategory)
    .map((m) => {
      const isVideo = Boolean(m.mimeType?.startsWith('video'))
      return {
        id: m.id,
        src: (isVideo ? m.url : mediaUrl(m, 'card')) ?? m.url!,
        full: (isVideo ? m.url : mediaUrl(m, 'hero')) ?? m.url!,
        alt: m.alt,
        caption: m.caption,
        category: m.galleryCategory!,
        isVideo,
        // Videos carry no dimensions; assume 16:9.
        width: m.width || 16,
        height: m.height || 9,
      }
    })

  const initial = GALLERY_CATEGORIES.some((g) => g.value === c) ? c : undefined

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments at the Crown"
        intro="Rooms, feasts, celebrations and the valley that surrounds us — in pictures and film."
        imageUrl={mediaUrl(settings.heroImage, 'hero')}
        videoUrl={mediaUrl(settings.ctaVideo)}
      />
      <section className="container-luxe pb-28">
        {items.length === 0 ? (
          <p className="py-20 text-center text-stone">Our gallery is being curated — please check back soon.</p>
        ) : (
          <GalleryGrid items={items} categories={GALLERY_CATEGORIES} initialCategory={initial} />
        )}
      </section>
    </>
  )
}
