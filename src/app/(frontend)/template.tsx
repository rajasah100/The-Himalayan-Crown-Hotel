'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

/** Re-mounts on every navigation: a curtain lifts and the new page eases in. */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(curtain.current, { display: 'none' })
      return
    }
    gsap
      .timeline()
      .to(curtain.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
      // clearProps: a leftover transform would break ScrollTrigger pinning and fixed overlays inside the page.
      .from(page.current, { autoAlpha: 0, y: 30, duration: 0.9, ease: 'expo.out', clearProps: 'all' }, 0.35)
      .set(curtain.current, { display: 'none' })
  })

  return (
    <>
      <div ref={curtain} data-curtain aria-hidden className="pointer-events-none fixed inset-0 z-[90] bg-ink">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold/60" />
      </div>
      <div ref={page}>{children}</div>
    </>
  )
}
