'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type ElementType, type ReactNode, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: boolean
  delay?: number
  y?: number
}

export function Reveal({ children, as: Tag = 'div', className, stagger, delay = 0, y = 48 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const targets = stagger ? Array.from(ref.current.children) : ref.current
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.4,
        delay,
        ease: 'expo.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
