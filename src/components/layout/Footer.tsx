import Link from 'next/link'

import { NewsletterForm } from '@/components/forms/NewsletterForm'
import type { SiteSetting } from '@/payload-types'

import { HOTEL_NAME, NAV_LINKS, SECONDARY_LINKS } from './nav'

export function Footer({ settings }: { settings: SiteSetting }) {
  const socials = [
    { label: 'Instagram', href: settings.instagram },
    { label: 'Facebook', href: settings.facebook },
    { label: 'Tripadvisor', href: settings.tripadvisor },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href))

  return (
    <footer className="bg-ink text-ivory">
      <div className="border-b border-ivory/10">
        <div className="container-luxe grid items-center gap-8 py-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-gold-light">Newsletter</p>
            <p className="display mt-3 text-3xl md:text-4xl">Stories from the Himalaya</p>
            <p className="mt-2 text-sm text-ivory/60">Seasonal offers, festival guides and first look at new experiences.</p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div className="container-luxe grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow text-gold">The</p>
          <p className="display text-5xl">Himalayan Crown</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
            A sanctuary of Newari craft and Himalayan calm, moments from the heart of Kathmandu.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5 text-ivory/50">Explore</p>
          <ul className="space-y-3 text-sm">
            {[...NAV_LINKS, ...SECONDARY_LINKS].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" className="link-underline">
                Reservations
              </Link>
            </li>
          </ul>
        </div>

        <address className="not-italic md:col-span-4">
          <p className="eyebrow mb-5 text-ivory/50">Contact</p>
          <div className="space-y-3 text-sm text-ivory/80">
            {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
            {settings.phone && (
              <p>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="link-underline">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="link-underline">
                  {settings.email}
                </a>
              </p>
            )}
          </div>
          {socials.length > 0 && (
            <ul className="mt-8 flex gap-6">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="eyebrow link-underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </address>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col justify-between gap-2 pt-6 pb-24 text-xs text-ivory/40 sm:flex-row md:pb-6">
          <p>
            © {new Date().getFullYear()} {HOTEL_NAME}. All rights reserved.
          </p>
          <p>Kathmandu · Nepal</p>
        </div>
      </div>
    </footer>
  )
}
