import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getRoomTypes } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description: 'Heritage rooms and Himalayan-view suites crafted with Newari woodwork and modern comfort.',
}

export default async function RoomsPage() {
  const rooms = await getRoomTypes()
  const hero = rooms.find((r) => r.category === 'suite') ?? rooms[0]

  return (
    <>
      <PageHero
        eyebrow="Stay"
        title="Rooms & Suites"
        intro="Every room is a quiet study in hand-carved timber, handwoven textiles and mountain light."
        imageUrl={mediaUrl(hero?.heroImage, 'hero')}
        imageAlt={mediaAlt(hero?.heroImage)}
      />

      <section className="container-luxe space-y-28 py-28 md:space-y-40 md:py-40">
        {rooms.map((room, i) => {
          const img = mediaUrl(room.heroImage, 'card')
          const flip = i % 2 === 1
          return (
            <article key={room.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
              <Reveal className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
                <Link href={`/rooms/${room.slug}`} className="group relative block aspect-[4/3] overflow-hidden">
                  {img && (
                    <Image
                      src={img}
                      alt={mediaAlt(room.heroImage, room.name)}
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                    />
                  )}
                </Link>
              </Reveal>
              <Reveal className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`} stagger>
                <p className="eyebrow text-gold">{room.tagline || room.category}</p>
                <h2 className="display mt-4 text-[clamp(2.25rem,4vw,3.5rem)]">{room.name}</h2>
                <p className="mt-6 leading-relaxed text-stone">{room.summary}</p>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-ink/10 py-6 text-sm">
                  <div>
                    <dt className="field-label">Size</dt>
                    <dd className="mt-1">{room.sizeSqm ? `${room.sizeSqm} m²` : '—'}</dd>
                  </div>
                  <div>
                    <dt className="field-label">Guests</dt>
                    <dd className="mt-1">Up to {room.maxAdults}</dd>
                  </div>
                  <div>
                    <dt className="field-label">From</dt>
                    <dd className="mt-1">${room.baseRateUSD}</dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href={`/rooms/${room.slug}`} className="btn btn-outline">
                    Explore
                  </Link>
                  <Link href="/book" className="btn btn-gold">
                    Book
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
