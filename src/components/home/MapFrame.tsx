'use client'

import clsx from 'clsx'
import { useState } from 'react'

type Props = { latitude: number; longitude: number; title: string; address?: string | null; mapUrl?: string | null }

/**
 * OpenStreetMap embed (no API key) with our own gold pin at the centre. The map ignores the
 * mouse until clicked, so scrolling the page never gets hijacked into zooming the map.
 */
export function MapFrame({ latitude, longitude, title, address, mapUrl }: Props) {
  const [active, setActive] = useState(false)
  const d = 0.012
  const bbox = [longitude - d * 1.7, latitude - d, longitude + d * 1.7, latitude + d].join('%2C')
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`

  return (
    <div className="relative h-full min-h-[460px] overflow-hidden bg-sand" onMouseLeave={() => setActive(false)}>
      <iframe
        title={`Map showing ${title}`}
        src={src}
        loading="lazy"
        className={clsx(
          'absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.35)_contrast(1.05)_brightness(1.03)]',
          !active && 'pointer-events-none',
        )}
      />

      {/* Centre pin (the bbox is centred on the hotel) */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <span className="absolute top-full left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/40" />
        <svg viewBox="0 0 32 44" className="relative h-11 w-8 drop-shadow-lg" aria-hidden>
          <path d="M16 0C7.2 0 0 7 0 15.7 0 27.5 16 44 16 44s16-16.5 16-28.3C32 7 24.8 0 16 0z" className="fill-ink" />
          <circle cx="16" cy="15.5" r="6" className="fill-gold" />
        </svg>
      </div>

      {/* Floating address card */}
      <div className="absolute top-5 left-5 max-w-[17rem] bg-ivory/95 p-5 shadow-xl backdrop-blur md:top-8 md:left-8">
        <p className="eyebrow text-[0.6rem] text-gold">You’ll find us</p>
        <p className="display mt-2 text-2xl leading-tight">{title}</p>
        {address && <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-stone">{address}</p>}
        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noreferrer" className="eyebrow link-underline mt-4 inline-block pb-0.5 text-[0.6rem]">
            Open in Google Maps ↗
          </a>
        )}
      </div>

      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="eyebrow absolute right-5 bottom-5 bg-ink/85 px-4 py-2.5 text-[0.6rem] text-ivory backdrop-blur hover:bg-ink md:right-8 md:bottom-8"
        >
          Click to explore the map
        </button>
      )}
    </div>
  )
}
