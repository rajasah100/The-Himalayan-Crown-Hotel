'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'

import { INTRO_STORAGE_KEY, markIntroDone } from '@/lib/intro'

gsap.registerPlugin(useGSAP)

/** First-visit curtain: the crown draws itself, the name fades in, then the curtain lifts. */
export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      let seen = false
      try {
        seen = Boolean(sessionStorage.getItem(INTRO_STORAGE_KEY))
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
      } catch {
        // storage blocked — just play it
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (seen || reduced) {
        markIntroDone()
        setGone(true)
        return
      }

      document.documentElement.style.overflow = 'hidden'
      const paths = gsap.utils.toArray<SVGPathElement>('[data-crown] path')
      paths.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })

      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = ''
            setGone(true)
          },
        })
        .to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: 'power2.inOut' })
        .from('[data-intro-text]', { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, '-=0.5')
        .to('[data-intro-inner]', { autoAlpha: 0, y: -20, duration: 0.5, ease: 'power2.in' }, '+=0.25')
        .add(markIntroDone)
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<0.1')
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <div
      ref={root}
      data-loader
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-ivory"
    >
      <div data-intro-inner className="flex flex-col items-center">
        <svg data-crown viewBox="0 0 120 90" className="h-20 w-24 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 68 L12 30 L36 50 L60 14 L84 50 L108 30 L108 68 Z" strokeLinejoin="round" />
          <path d="M12 80 H108" strokeLinecap="round" />
          <path d="M60 14 m-4 -6 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
        </svg>
        <p data-intro-text className="eyebrow mt-8 text-gold-light">
          The
        </p>
        <p data-intro-text className="display mt-2 text-4xl">
          Himalayan Crown
        </p>
      </div>
    </div>
  )
}
