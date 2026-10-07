'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  // New page → start at the top and let ScrollTrigger re-measure.
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
