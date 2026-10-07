'use client'

import clsx from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type Review = {
  id: number
  quote: string
  guestName: string
  origin?: string | null
  source?: string | null
  rating?: number | null
  stayDate?: string | null
  isSample?: boolean | null
}

type Props = {
  reviews: Review[]
  rating?: { value: number; count?: number | null; source?: string | null } | null
  /** Optional background photograph, darkened so the quotes stay legible. */
  imageUrl?: string | null
  imageAlt?: string
}

const SOURCE: Record<string, string> = { tripadvisor: 'TripAdvisor', google: 'Google', booking: 'Booking.com', direct: 'Direct stay' }

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-1 text-gold" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={clsx('h-3.5 w-3.5', i < Math.round(value) ? 'fill-current' : 'fill-none stroke-current')}>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  )
}

/** Cross-fading testimonial carousel; auto-advances, pauses on hover/focus. */
export function Reviews({ reviews, rating, imageUrl, imageAlt = '' }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (next: number) => {
      const el = quoteRef.current
      const target = (next + reviews.length) % reviews.length
      if (!el) return setIndex(target)
      gsap.to(el, {
        autoAlpha: 0,
        y: -12,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setIndex(target)
          gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' })
        },
      })
    },
    [reviews.length],
  )

  useEffect(() => {
    if (paused || reviews.length < 2) return
    const id = setTimeout(() => go(index + 1), 7000)
    return () => clearTimeout(id)
  }, [go, index, paused, reviews.length])

  if (reviews.length === 0) return null
  const r = reviews[index]

  return (
    <section
      className="relative overflow-hidden bg-ink py-24 text-ivory md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {imageUrl && (
        <>
          <div className="absolute inset-0 animate-[kenburns_30s_ease-out_infinite_alternate]">
            <Image src={imageUrl} alt={imageAlt} fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-ink/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(21,18,14,0.6)_80%)]" />
        </>
      )}
      <div className="container-luxe relative max-w-4xl text-center">
        <p className="eyebrow text-gold-light">Guest stories</p>
        {rating && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="display text-5xl">
              {rating.value.toFixed(1)}
              <span className="text-2xl text-ivory/60">/5</span>
            </p>
            <Stars value={rating.value} />
            {(rating.count || rating.source) && (
              <p className="field-label">
                {rating.count ? `${rating.count.toLocaleString()} reviews` : ''}
                {rating.count && rating.source ? ' on ' : ''}
                {rating.source}
              </p>
            )}
          </div>
        )}

        <div ref={quoteRef} className="mt-12 min-h-[16rem] md:min-h-[13rem]" aria-live="polite">
          <svg viewBox="0 0 40 30" className="mx-auto h-8 w-10 fill-gold-light/50" aria-hidden>
            <path d="M0 30V17C0 7.6 5 1.9 15 0l1.6 3.8C10.8 5.6 8 9 7.6 13.5H15V30H0zm25 0V17C25 7.6 30 1.9 40 0l1.6 3.8c-5.8 1.8-8.6 5.2-9 9.7H40V30H25z" />
          </svg>
          <blockquote className="display mt-6 text-[clamp(1.5rem,3vw,2.4rem)] leading-snug italic">{r.quote}</blockquote>
          <p className="mt-8 text-sm">
            <span className="font-semibold">{r.guestName}</span>
            {r.origin && <span className="text-ivory/60"> · {r.origin}</span>}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            {r.rating ? <Stars value={r.rating} /> : null}
            {r.source && <span className="field-label">{SOURCE[r.source] ?? r.source}</span>}
            {r.stayDate && <span className="field-label">· {r.stayDate}</span>}
            {r.isSample && (
              <span className="rounded-full border border-ivory/25 px-2 py-0.5 text-[0.6rem] tracking-widest text-ivory/60 uppercase">
                Sample
              </span>
            )}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button type="button" onClick={() => go(index - 1)} className="eyebrow hover:text-gold" aria-label="Previous review">
              ←
            </button>
            <div className="flex gap-2">
              {reviews.map((rev, i) => (
                <button
                  key={rev.id}
                  type="button"
                  onClick={() => i !== index && go(i)}
                  aria-label={`Show review ${i + 1}`}
                  aria-current={i === index}
                  className={clsx('h-px transition-all duration-500', i === index ? 'w-10 bg-gold' : 'w-5 bg-ivory/25')}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(index + 1)} className="eyebrow hover:text-gold" aria-label="Next review">
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
