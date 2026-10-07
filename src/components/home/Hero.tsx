'use client'

import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { BookingBar } from '@/components/booking/BookingBar'
import { BackgroundVideo } from '@/components/media/BackgroundVideo'
import { FilmModal } from '@/components/media/FilmModal'
import { onIntroDone } from '@/lib/intro'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Media = { imageUrl: string | null; videoUrl?: string | null; alt: string }

type Props = {
  title: string
  subtitle?: string | null
  day: Media
  night?: Media | null
  filmUrl?: string | null
  weather?: { temperature: number; label: string } | null
}

const kathmanduHour = () =>
  Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))

const kathmanduTime = () =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kathmandu', hour: 'numeric', minute: '2-digit' }).format(new Date())

function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning from Kathmandu'
  if (hour >= 12 && hour < 17) return 'Good afternoon from Kathmandu'
  return 'Good evening from Kathmandu'
}

function HeroMedia({ media, priority }: { media: Media; priority?: boolean }) {
  return media.videoUrl ? (
    <BackgroundVideo src={media.videoUrl} poster={media.imageUrl} alt={media.alt} priority={priority} />
  ) : (
    media.imageUrl && <Image src={media.imageUrl} alt={media.alt} fill priority={priority} sizes="100vw" className="object-cover" />
  )
}

export function Hero({ title, subtitle, day, night, filmUrl, weather }: Props) {
  const root = useRef<HTMLElement>(null)
  // Server render is always "day"; the client switches to the evening scene after mount.
  const [clock, setClock] = useState<{ time: string; hour: number } | null>(null)
  const isNight = Boolean(night && clock && (clock.hour >= 18 || clock.hour < 6))

  useEffect(() => {
    const tick = () => setClock({ time: kathmanduTime(), hour: kathmanduHour() })
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      tl.fromTo(
        '[data-hero-frame]',
        { clipPath: 'inset(6% 5% 6% 5%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' },
      )
        .from('[data-hero-media]', { scale: 1.25, duration: 2.6, ease: 'power3.out' }, 0)
        .from('[data-hero-word]', { yPercent: 115, duration: 1.6, stagger: 0.07 }, 0.5)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1.4, stagger: 0.1 }, 1.0)

      const stop = onIntroDone(() => tl.play())

      // Media drifts and darkens as the guest scrolls into the page.
      gsap.to('[data-hero-media]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-veil]', {
        opacity: 0.8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return stop
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-ivory">
      <div data-hero-frame className="absolute inset-0 overflow-hidden">
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <div className={clsx('absolute inset-0 transition-opacity duration-[1.5s]', isNight ? 'opacity-0' : 'opacity-100')}>
            <HeroMedia media={day} priority />
          </div>
          {night && (
            <div
              className={clsx(
                'absolute inset-0 transition-opacity duration-[1.5s]',
                isNight ? 'animate-[kenburns_24s_ease-out_forwards] opacity-100' : 'opacity-0',
              )}
            >
              {isNight && <HeroMedia media={night} />}
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/10 to-ink/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(21,18,14,0.45)_0%,transparent_65%)]" />
        <div data-hero-veil className="absolute inset-0 bg-ink opacity-0" />
      </div>

      <div className="container-luxe relative flex flex-1 flex-col items-center justify-center pt-28 pb-8 text-center">
        <p
          data-hero-fade
          className="eyebrow mb-6 flex items-center gap-4 text-ivory/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] md:mb-8"
        >
          <span className="hidden h-px w-8 bg-gold-light sm:block" aria-hidden />
          {clock ? greetingFor(clock.hour) : 'Namaste from Kathmandu'}
          <span className="hidden h-px w-8 bg-gold-light sm:block" aria-hidden />
        </p>
        <h1 className="display max-w-5xl text-[clamp(3.25rem,8vw,7.5rem)] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
          {title.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-hero-word className="inline-block">
                {word}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        {subtitle && (
          <p
            data-hero-fade
            className="mt-6 max-w-xl text-base leading-relaxed text-ivory/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:mt-8 md:text-lg"
          >
            {subtitle}
          </p>
        )}
        <div data-hero-fade className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          {filmUrl && <FilmModal src={filmUrl} poster={day.imageUrl} />}
          <Link href="/book" className="btn btn-gold md:hidden">
            Book your stay
          </Link>
        </div>
      </div>

      {/* Live strip: local time + weather on the left, scroll cue on the right */}
      <div data-hero-fade className="container-luxe relative mb-4 flex items-center justify-between gap-6 text-xs text-ivory/80">
        <p className="flex items-center gap-3 tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
          </span>
          <span>
            Kathmandu{clock && <> · {clock.time}</>}
            {weather && (
              <>
                {' '}
                · {weather.temperature}°C {weather.label}
              </>
            )}
          </span>
        </p>
        <p className="eyebrow hidden items-center gap-3 text-[0.6rem] md:flex" aria-hidden>
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-ivory/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ivory" />
          </span>
        </p>
      </div>

      <div data-hero-fade className="container-luxe relative hidden pb-10 md:block">
        <BookingBar />
      </div>
      <div className="pb-6 md:hidden" />
    </section>
  )
}
