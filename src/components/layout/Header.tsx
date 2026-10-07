'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { HOTEL_NAME, NAV_LINKS, SECONDARY_LINKS } from './nav'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu after navigating (adjusting state during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  const solid = scrolled || open

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,color,padding] duration-700 ease-luxe',
        solid ? 'bg-ivory/95 py-3 text-ink backdrop-blur-md' : 'bg-transparent py-6 text-ivory',
      )}
    >
      <div className="container-luxe flex items-center justify-between gap-6">
        <Link href="/" className="group flex flex-col leading-none" aria-label={`${HOTEL_NAME} home`}>
          <span className="eyebrow text-[0.55rem] text-gold">The</span>
          <span className="display text-2xl tracking-wide md:text-[1.7rem]">Himalayan Crown</span>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex 2xl:gap-11" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx('eyebrow link-underline pb-1', pathname.startsWith(link.href) && 'text-gold')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/book" className="btn btn-gold hidden px-6 py-3 sm:inline-flex">
            Book your stay
          </Link>
          <button
            type="button"
            className="relative h-10 w-10 xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={clsx(
                'absolute left-2 right-2 h-px bg-current transition-transform duration-500',
                open ? 'top-1/2 rotate-45' : 'top-[40%]',
              )}
            />
            <span
              className={clsx(
                'absolute left-2 right-2 h-px bg-current transition-transform duration-500',
                open ? 'top-1/2 -rotate-45' : 'top-[60%]',
              )}
            />
          </button>
        </div>
      </div>

      <div
        className={clsx(
          'grid overflow-hidden transition-[grid-template-rows] duration-700 ease-luxe xl:hidden',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <nav className="min-h-0" aria-label="Mobile">
          <ul className="container-luxe flex max-h-[calc(100svh-5rem)] flex-col gap-4 overflow-y-auto py-8" data-lenis-prevent>
            {[...NAV_LINKS, ...SECONDARY_LINKS].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="display text-3xl">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" className="btn btn-gold mt-2 w-full">
                Book your stay
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
