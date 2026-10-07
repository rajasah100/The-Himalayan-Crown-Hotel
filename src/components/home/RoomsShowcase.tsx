'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type ShowcaseRoom = {
  slug: string
  name: string
  tagline?: string | null
  sizeSqm?: number | null
  view?: string | null
  rate: number
  imageUrl: string | null
  imageAlt: string
  videoUrl?: string | null
}

function RoomCard({ room, index }: { room: ShowcaseRoom; index: number }) {
  const video = useRef<HTMLVideoElement>(null)

  const play = () => {
    const v = video.current
    if (!v || !room.videoUrl) return
    if (!v.src) v.src = room.videoUrl
    v.play().catch(() => {})
  }
  const stop = () => video.current?.pause()

  return (
    <Link
      href={`/rooms/${room.slug}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="group relative block aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden sm:w-[56vw] lg:h-[min(64svh,680px)] lg:w-auto"
    >
      {room.imageUrl && (
        <Image
          src={room.imageUrl}
          alt={room.imageAlt}
          fill
          sizes="(min-width: 1024px) 45vw, 80vw"
          className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
        />
      )}
      {room.videoUrl && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
      <span className="display absolute top-5 left-6 text-xl text-ivory/80">{String(index + 1).padStart(2, '0')}</span>
      {room.videoUrl && (
        <span className="eyebrow absolute top-6 right-6 hidden text-[0.6rem] text-ivory/70 lg:block">
          Hover to preview
        </span>
      )}
      <div className="absolute inset-x-6 bottom-6">
        {room.tagline && <p className="eyebrow mb-3 text-gold-light">{room.tagline}</p>}
        <h3 className="display text-3xl md:text-4xl">{room.name}</h3>
        <p className="mt-3 text-sm text-ivory/75">
          {[room.sizeSqm && `${room.sizeSqm} m²`, room.view].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-4 flex items-center justify-between border-t border-ivory/20 pt-4 text-sm">
          <span>
            From <span className="display text-xl">${room.rate.toLocaleString()}</span> / night
          </span>
          <span className="eyebrow text-[0.6rem] transition-transform duration-500 group-hover:translate-x-1">
            Explore →
          </span>
        </p>
      </div>
    </Link>
  )
}

/** Desktop: pinned section that scrolls the room cards horizontally. Mobile: a native swipe row. */
export function RoomsShowcase({ rooms }: { rooms: ShowcaseRoom[] }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
          },
        })
      })
      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} className="overflow-hidden bg-ink text-ivory lg:h-svh">
      <div className="flex h-full flex-col justify-center py-24 lg:pt-24 lg:pb-10">
        <div className="container-luxe mb-10 flex items-end justify-between gap-8 lg:mb-8">
          <div>
            <p className="eyebrow text-gold-light">Stay</p>
            <h2 className="display mt-3 text-[clamp(2.5rem,4.5vw,4rem)]">Rooms &amp; Suites</h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden h-px w-40 bg-ivory/15 lg:block">
              <div ref={progress} className="h-full origin-left scale-x-0 bg-gold" />
            </div>
            <Link href="/rooms" className="eyebrow link-underline pb-1">
              View all
            </Link>
          </div>
        </div>

        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-4 [scrollbar-width:none] lg:snap-none lg:gap-8 lg:overflow-visible lg:pb-0"
        >
          {rooms.map((room, i) => (
            <RoomCard key={room.slug} room={room} index={i} />
          ))}
          <div className="w-px shrink-0 lg:w-[4vw]" aria-hidden />
        </div>
      </div>
    </section>
  )
}
