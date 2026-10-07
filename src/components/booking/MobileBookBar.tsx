'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { WhatsAppIcon, whatsappHref } from '@/components/layout/WhatsAppButton'

/** Phone-only sticky bar (call · WhatsApp · book) that slides in after the first screen. */
export function MobileBookBar({ phone, whatsapp }: { phone?: string | null; whatsapp?: string | null }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname.startsWith('/book')) return null

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-ivory/95 backdrop-blur-md transition-transform duration-700 ease-luxe md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      {phone && (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="eyebrow flex flex-1 items-center justify-center py-4">
          Call
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsappHref(whatsapp)}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="flex w-16 items-center justify-center border-l border-ink/10 text-[#1f8f4e]"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
      )}
      <Link href="/book" className="btn btn-gold flex-[2] py-4">
        Book your stay
      </Link>
    </div>
  )
}
