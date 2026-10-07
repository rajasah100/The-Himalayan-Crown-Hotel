import Image from 'next/image'

import { HOTEL_NAME } from '@/components/layout/nav'
import { Reveal } from '@/components/motion/Reveal'

import { MapFrame } from './MapFrame'

type Props = {
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  mapUrl?: string | null
  imageUrl?: string | null
  imageAlt?: string
  distances: { id?: string | null; place: string; time: string }[]
}

/** "20 min" → { value: "20", unit: "min" } so the number can be set large. */
const splitTime = (time: string) => {
  const m = time.trim().match(/^([\d.]+)\s*(.*)$/)
  return m ? { value: m[1], unit: m[2] } : { value: time, unit: '' }
}

export function LocationSection({ address, latitude, longitude, mapUrl, imageUrl, imageAlt = '', distances }: Props) {
  if (!latitude || !longitude) return null

  return (
    <section className="bg-sand py-24 md:py-36">
      <div className="container-luxe">
        <Reveal className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end" stagger>
          <div className="md:col-span-7">
            <p className="eyebrow text-gold">Location</p>
            <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">In the heart of the valley</h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="leading-relaxed text-stone">
              A quiet, leafy corner of Lazimpat — minutes from Thamel’s cafés, the old royal palace and the valley’s
              great temples, yet worlds away from the bustle.
            </p>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-outline mt-8">
                Get directions
              </a>
            )}
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            {imageUrl && (
              <Reveal className="relative aspect-[16/10] overflow-hidden">
                <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 text-xs tracking-wide text-ivory/90">
                  {latitude.toFixed(4)}° N · {longitude.toFixed(4)}° E
                </p>
              </Reveal>
            )}
            {distances.length > 0 && (
              <Reveal className="grid grid-cols-2 gap-px bg-ink/10" stagger y={20}>
                {distances.map((x, i) => {
                  const t = splitTime(x.time)
                  return (
                    <div key={x.id ?? i} className="bg-ivory p-5 last:odd:col-span-2">
                      <p className="display text-4xl leading-none text-gold">
                        {t.value}
                        <span className="ml-1 font-sans text-xs tracking-widest text-stone uppercase">{t.unit}</span>
                      </p>
                      <p className="mt-3 text-sm leading-snug">{x.place}</p>
                    </div>
                  )
                })}
              </Reveal>
            )}
          </div>

          <Reveal className="lg:col-span-7">
            <MapFrame latitude={latitude} longitude={longitude} title={HOTEL_NAME} address={address} mapUrl={mapUrl} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
