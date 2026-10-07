import type { Metadata } from 'next'
import Link from 'next/link'

import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getDining, getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reservations, table bookings, spa appointments and general enquiries — we are here to help.',
}

type Props = { searchParams: Promise<{ type?: string; venue?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const { type, venue } = await searchParams
  const [settings, dining] = await Promise.all([getSiteSettings(), getDining()])
  const venueName = dining.find((d) => d.slug === venue)?.name

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Namaste"
        intro="Reservations, a table for two or a question about Kathmandu — our team is here around the clock."
        imageUrl={mediaUrl(settings.introImage, 'hero')}
        imageAlt={mediaAlt(settings.introImage)}
      />

      <section className="container-luxe grid gap-16 py-24 md:grid-cols-12 md:py-36">
        <Reveal className="md:col-span-4" stagger>
          <p className="eyebrow text-gold">Find us</p>
          <h2 className="display mt-6 text-5xl">Get in touch</h2>
          <dl className="mt-10 space-y-6 text-sm">
            {settings.address && (
              <div>
                <dt className="field-label">Address</dt>
                <dd className="mt-1 whitespace-pre-line text-stone">{settings.address}</dd>
              </div>
            )}
            {settings.phone && (
              <div>
                <dt className="field-label">Telephone</dt>
                <dd className="mt-1">
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="link-underline text-stone">
                    {settings.phone}
                  </a>
                </dd>
              </div>
            )}
            {settings.whatsapp && (
              <div>
                <dt className="field-label">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-stone"
                  >
                    {settings.whatsapp}
                  </a>
                </dd>
              </div>
            )}
            {settings.email && (
              <div>
                <dt className="field-label">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${settings.email}`} className="link-underline text-stone">
                    {settings.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {settings.mapUrl && (
            <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="btn btn-outline mt-10">
              Get directions
            </a>
          )}
          <p className="mt-10 border-t border-ink/10 pt-8 text-sm text-stone">
            Planning a wedding or event?{' '}
            <Link href="/weddings#enquire" className="link-underline text-ink">
              Talk to our planners
            </Link>
          </p>
        </Reveal>
        <Reveal className="md:col-span-7 md:col-start-6">
          <EnquiryForm
            defaultType={type ?? 'general'}
            defaultMessage={venueName ? `I would like to reserve a table at ${venueName}.` : ''}
          />
        </Reveal>
      </section>
    </>
  )
}
