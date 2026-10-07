'use client'

import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { type ReactNode, useRef } from 'react'

import { BackgroundVideo } from '@/components/media/BackgroundVideo'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  src?: string | null
  alt: string
  /** Optional muted loop played over the image (the image becomes its poster). */
  video?: string | null
  className?: string
  sizes?: string
  priority?: boolean
  /** CSS object-position for cropping. */
  position?: string
  /** Percentage the media drifts while the frame crosses the viewport. */
  strength?: number
  children?: ReactNode
}

/** Clip-path reveal on enter, then a slow parallax drift — the signature luxury-site image. */
export function ParallaxImage({
  src,
  alt,
  video,
  className,
  sizes = '100vw',
  priority,
  position = '50% 50%',
  strength = 12,
  children,
}: Props) {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        frame.current,
        { clipPath: 'inset(10% 6% 10% 6%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: frame.current, start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        inner.current,
        { yPercent: -strength / 2 },
        {
          yPercent: strength / 2,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: frame },
  )

  return (
    <div ref={frame} className={clsx('relative overflow-hidden bg-ink', className)}>
      <div ref={inner} className="absolute inset-x-0 -inset-y-[10%]">
        {video ? (
          <BackgroundVideo src={video} poster={src} alt={alt} sizes={sizes} position={position} priority={priority} />
        ) : (
          src && (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={{ objectPosition: position }}
            />
          )
        )}
      </div>
      {children}
    </div>
  )
}
