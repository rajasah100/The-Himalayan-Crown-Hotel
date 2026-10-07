'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'

import { BackgroundVideo } from '@/components/media/BackgroundVideo'

gsap.registerPlugin(useGSAP)

type Props = {
  eyebrow: string
  title: string
  intro?: string | null
  imageUrl?: string | null
  imageAlt?: string
  videoUrl?: string | null
}

export function PageHero({ eyebrow, title, intro, imageUrl, imageAlt = '', videoUrl }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-media]', { scale: 1.12, duration: 2.4, ease: 'power3.out' })
        .from('[data-line]', { yPercent: 110, duration: 1.5, stagger: 0.1 }, 0.2)
        .from('[data-fade]', { autoAlpha: 0, y: 20, duration: 1.2 }, 0.7)
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink text-ivory">
      <div data-media className="absolute inset-0">
        {videoUrl ? (
          <BackgroundVideo src={videoUrl} poster={imageUrl} alt={imageAlt} priority />
        ) : (
          imageUrl && <Image src={imageUrl} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/30 to-ink/80" />
      <div className="container-luxe relative pt-40 pb-16 md:pb-24">
        <p className="overflow-hidden">
          <span data-line className="eyebrow inline-block text-gold-light">
            {eyebrow}
          </span>
        </p>
        <h1 className="display mt-6 overflow-hidden text-[clamp(2.75rem,7vw,6.5rem)]">
          <span data-line className="inline-block">
            {title}
          </span>
        </h1>
        {intro && (
          <p data-fade className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/80 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
