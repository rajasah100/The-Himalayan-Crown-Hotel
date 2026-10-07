import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { ParallaxImage } from '@/components/motion/ParallaxImage'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getDining } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Dining',
  description: 'Newari feasts, Himalayan tasting menus, a heritage courtyard café and a rooftop bar.',
}

export default async function DiningPage() {
  const venues = await getDining()

  return (
    <>
      <PageHero
        eyebrow="Dine"
        title="Restaurants & Bars"
        intro="From a royal Newari bhoj to sundowners facing the Himalaya."
        imageUrl={mediaUrl(venues[0]?.image, 'hero')}
        imageAlt={mediaAlt(venues[0]?.image)}
        videoUrl={mediaUrl(venues[0]?.video)}
      />

      <section className="container-luxe space-y-28 py-28 md:space-y-40 md:py-40">
        {venues.map((venue, i) => {
          const img = mediaUrl(venue.image, 'card')
          const flip = i % 2 === 1
          return (
            <article key={venue.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
              {img && (
                <ParallaxImage
                  src={img}
                  video={i === 0 ? null : mediaUrl(venue.video)}
                  alt={mediaAlt(venue.image, venue.name)}
                  className={`aspect-[4/3] md:col-span-7 ${flip ? 'md:order-2' : ''}`}
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
              )}
              <Reveal className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`} stagger>
                <p className="eyebrow text-gold">{venue.cuisine}</p>
                <h2 className="display mt-4 text-[clamp(2.25rem,4vw,3.5rem)]">{venue.name}</h2>
                <p className="mt-6 leading-relaxed text-stone">{venue.summary}</p>
                <dl className="mt-8 space-y-2 text-sm">
                  {venue.hours && (
                    <div className="flex gap-4">
                      <dt className="field-label w-24 pt-0.5">Hours</dt>
                      <dd>{venue.hours}</dd>
                    </div>
                  )}
                  {venue.dressCode && (
                    <div className="flex gap-4">
                      <dt className="field-label w-24 pt-0.5">Dress</dt>
                      <dd>{venue.dressCode}</dd>
                    </div>
                  )}
                </dl>
                <div>
                  <Link href={`/contact?type=dining&venue=${venue.slug}`} className="btn btn-outline mt-8">
                    Reserve a table
                  </Link>
                </div>
              </Reveal>
            </article>
          )
        })}
      </section>
    </>
  )
}
