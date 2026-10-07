'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster?: string | null
  alt?: string
  className?: string
  /** CSS object-position, e.g. "70% 50%" to keep the subject in frame when cropped. */
  position?: string
  priority?: boolean
  sizes?: string
}

const prefersStill = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

/**
 * Muted looping video that only downloads/plays while on screen, fades in over its poster once
 * frames are ready, and stays a still image for reduced-motion or data-saver visitors.
 */
export function BackgroundVideo({ src, poster, alt = '', className, position = '50% 50%', priority, sizes = '100vw' }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (prefersStill()) return
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setEnabled(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  // Play/pause only after React has applied `src` — calling play() before that silently fails.
  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return
    if (inView) video.play().catch(() => {})
    else video.pause()
  }, [enabled, inView, src])

  return (
    <div className={clsx('absolute inset-0 overflow-hidden', className)}>
      {poster && (
        <Image
          src={poster}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      )}
      <video
        ref={ref}
        className={clsx(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.2s]',
          playing ? 'opacity-100' : 'opacity-0',
        )}
        style={{ objectPosition: position }}
        src={enabled ? src : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        onPlaying={() => setPlaying(true)}
      />
    </div>
  )
}
