import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookingBar } from '@/components/booking/BookingBar'
import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { isMedia, mediaAlt, mediaUrl } from '@/lib/media'
import { getRoomTypeBySlug, getRoomTypes } from '@/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const rooms = await getRoomTypes()
  return rooms.map((r) => ({ slug: r.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoomTypeBySlug((await params).slug)
  if (!room) return {}
  return {
    title: room.name,
    description: room.summary,
    openGraph: { images: mediaUrl(room.heroImage, 'card') ?? undefined },
  }
}

export default async function RoomPage({ params }: Props) {
  const room = await getRoomTypeBySlug((await params).slug)
  if (!room) notFound()

  const gallery = (room.gallery ?? []).filter(isMedia)
  const facts = [
    { label: 'Size', value: room.sizeSqm ? `${room.sizeSqm} m²` : null },
    { label: 'Occupancy', value: `${room.maxAdults} adults${room.maxChildren ? ` + ${room.maxChildren} child` : ''}` },
    { label: 'Bed', value: room.bed },
    { label: 'View', value: room.view },
  ].filter((f) => f.value)

  return (
    <>
      <PageHero
        eyebrow={room.tagline || 'Rooms & Suites'}
        title={room.name}
        imageUrl={mediaUrl(room.heroImage, 'hero')}
        imageAlt={mediaAlt(room.heroImage, room.name)}
        videoUrl={mediaUrl(room.video)}
      />

      <section className="container-luxe grid gap-16 py-24 md:grid-cols-12 md:py-32">
        <Reveal className="md:col-span-7" stagger>
          <p className="display text-[clamp(1.6rem,2.6vw,2.25rem)] leading-snug">{room.summary}</p>
          {room.description && (
            <div className="prose-luxe mt-10 space-y-5 leading-relaxed text-stone">
              <RichText data={room.description} />
            </div>
          )}
        </Reveal>

        <Reveal className="md:col-span-4 md:col-start-9">
          <dl className="divide-y divide-ink/10 border-y border-ink/10">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between py-4 text-sm">
                <dt className="field-label">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div className="flex justify-between py-4 text-sm">
              <dt className="field-label">From</dt>
              <dd className="display text-2xl">
                ${room.baseRateUSD}
                <span className="font-sans text-xs text-stone"> / night</span>
              </dd>
            </div>
          </dl>
          {room.amenities && room.amenities.length > 0 && (
            <>
              <p className="eyebrow mt-10 mb-4 text-gold">In your room</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-stone">
                {room.amenities.map((a) => (
                  <li key={a.id}>— {a.label}</li>
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </section>

      {gallery.length > 0 && (
        <section className="container-luxe grid gap-4 pb-24 sm:grid-cols-2 md:pb-32">
          {gallery.map((img, i) => (
            <Reveal
              key={img.id}
              className={`relative overflow-hidden ${i % 3 === 0 ? 'aspect-[16/9] sm:col-span-2' : 'aspect-[4/3]'}`}
            >
              <Image src={mediaUrl(img, 'card')!} alt={img.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
            </Reveal>
          ))}
        </section>
      )}

      <section className="bg-sand py-20">
        <div className="container-luxe">
          <h2 className="display mb-8 text-4xl">Reserve the {room.name}</h2>
          <BookingBar tone="solid" />
        </div>
      </section>
    </>
  )
}
