'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

type Props = { src: string; poster?: string | null; className?: string; label?: string }

export function FilmModal({ src, poster, className, label = 'Watch the film' }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open) {
      d.showModal()
      video.current?.play().catch(() => {})
    } else if (d.open) {
      video.current?.pause()
      d.close()
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx('group inline-flex items-center gap-4', className)}
      >
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-current transition-colors duration-500 group-hover:border-gold group-hover:bg-gold">
          <span className="absolute inset-0 animate-ping rounded-full border border-current opacity-20" />
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </span>
        <span className="eyebrow">{label}</span>
      </button>

      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink/95 p-0 backdrop:bg-ink/80"
      >
        <div className="flex h-full w-full items-center justify-center p-4 md:p-12">
          <video
            ref={video}
            src={open ? src : undefined}
            poster={poster ?? undefined}
            controls
            playsInline
            className="max-h-full w-full max-w-6xl bg-black shadow-2xl"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="eyebrow absolute top-6 right-6 text-ivory hover:text-gold"
          aria-label="Close film"
        >
          Close ✕
        </button>
      </dialog>
    </>
  )
}
