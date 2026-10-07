'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

const OFFSET = 180 // sticky header + this bar

/** Sticky category bar that highlights the section in view and scrolls to it on click. */
export function MenuNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= OFFSET) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  // Keep the active tab visible on phones — scroll the bar only, never the page.
  useEffect(() => {
    const container = bar.current
    const tab = container?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!container || !tab) return
    container.scrollTo({ left: tab.offsetLeft - container.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <div className="sticky top-[68px] z-30 border-y border-ink/10 bg-ivory/95 backdrop-blur-md">
      <div ref={bar} className="container-luxe relative flex gap-7 overflow-x-auto py-4 [scrollbar-width:none] md:justify-center md:gap-10">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-id={s.id}
            className={clsx(
              'eyebrow shrink-0 border-b pb-1 transition-colors duration-300',
              active === s.id ? 'border-gold text-gold' : 'border-transparent text-stone hover:text-ink',
            )}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  )
}
