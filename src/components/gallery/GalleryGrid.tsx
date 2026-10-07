'use client'

import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

gsap.registerPlugin(useGSAP)

export type GalleryItem = {
  id: number
  src: string
  full: string
  alt: string
  caption?: string | null
  category: string
  isVideo: boolean
  width: number
  height: number
}

type Props = {
  items: GalleryItem[]
  categories: readonly { label: string; value: string }[]
  initialCategory?: string
}

function Tile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => video.current?.play().catch(() => {})}
      onMouseLeave={() => video.current?.pause()}
      data-tile
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-sand text-left"
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
      aria-label={`Open ${item.alt}`}
    >
      {item.isVideo ? (
        <video
          ref={video}
          src={`${item.src}#t=0.5`}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {item.isVideo && (
        <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden>
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </span>
      )}
      <span className="absolute inset-x-5 bottom-4 translate-y-2 text-sm text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {item.caption || item.alt}
      </span>
    </button>
  )
}

function Lightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const item = items[index]
  const touchX = useRef<number | null>(null)
  const go = useCallback((delta: number) => onIndex((index + delta + items.length) % items.length), [index, items.length, onIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [go, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex flex-col bg-ink/97 text-ivory"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <span className="eyebrow text-ivory/60">
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} className="eyebrow hover:text-gold" aria-label="Close gallery">
          Close ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {item.isVideo ? (
          <video key={item.id} src={item.full} controls autoPlay playsInline className="max-h-full max-w-full" />
        ) : (
          <div key={item.id} className="relative h-full w-full">
            <Image src={item.full} alt={item.alt} fill sizes="100vw" className="object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 hover:border-gold hover:text-gold md:left-8 md:flex"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 hover:border-gold hover:text-gold md:right-8 md:flex"
          aria-label="Next"
        >
          →
        </button>
      </div>

      <p className="px-5 py-5 text-center text-sm text-ivory/70 md:px-8">{item.caption || item.alt}</p>
    </div>
  )
}

export function GalleryGrid({ items, categories, initialCategory }: Props) {
  const [category, setCategory] = useState(initialCategory ?? 'all')
  const [open, setOpen] = useState<number | null>(null)
  const grid = useRef<HTMLDivElement>(null)

  const visible = useMemo(
    () => (category === 'all' ? items : items.filter((i) => i.category === category)),
    [category, items],
  )
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const i of items) c[i.category] = (c[i.category] ?? 0) + 1
    return c
  }, [items])

  const select = (value: string) => {
    setCategory(value)
    const url = new URL(window.location.href)
    if (value === 'all') url.searchParams.delete('c')
    else url.searchParams.set('c', value)
    window.history.replaceState(null, '', url)
  }

  useGSAP(
    () => {
      gsap.from('[data-tile]', { autoAlpha: 0, y: 40, duration: 1, stagger: 0.05, ease: 'expo.out' })
    },
    { scope: grid, dependencies: [category] },
  )

  const tabs = [{ label: 'All', value: 'all' }, ...categories.filter((c) => counts[c.value])]

  return (
    <>
      <div className="sticky top-[68px] z-30 -mx-[clamp(1rem,4vw,3.5rem)] mb-10 border-b border-ink/10 bg-ivory/95 px-[clamp(1rem,4vw,3.5rem)] backdrop-blur-md">
        <div className="flex gap-6 overflow-x-auto py-4 [scrollbar-width:none] md:gap-9" role="tablist" aria-label="Gallery categories">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={category === tab.value}
              onClick={() => select(tab.value)}
              className={clsx(
                'eyebrow shrink-0 border-b pb-1 transition-colors duration-300',
                category === tab.value ? 'border-gold text-gold' : 'border-transparent text-stone hover:text-ink',
              )}
            >
              {tab.label}
              <span className="ml-2 text-[0.6rem] opacity-60">{tab.value === 'all' ? items.length : counts[tab.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={grid} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((item, i) => (
          <Tile key={`${category}-${item.id}`} item={item} onOpen={() => setOpen(i)} />
        ))}
      </div>

      {open !== null && visible[open] && (
        <Lightbox items={visible} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </>
  )
}
