import clsx from 'clsx'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { PageHero } from '@/components/layout/PageHero'
import { ParallaxImage } from '@/components/motion/ParallaxImage'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getEventVenues, getGalleryMedia, getSiteSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Weddings & Celebrations',
  description:
    'Hindu, Newari, Buddhist and destination weddings in Kathmandu — courtyards, ballroom and garden lawns for up to 800 guests.',
}

const SETTING_LABEL = { indoor: 'Indoor', outdoor: 'Outdoor', both: 'Indoor & outdoor' } as const

export default async function WeddingsPage() {
  const [settings, venues, galleryMedia] = await Promise.all([getSiteSettings(), getEventVenues(), getGalleryMedia('weddings')])

  const galleryImages = galleryMedia.filter((m) => m.mimeType?.startsWith('image')).slice(0, 5)
  const ceremonies = settings.ceremonies ?? []
  const packages = settings.weddingPackages ?? []
  const bandImage = mediaUrl(settings.weddingBandImage, 'hero')
  const bandVideo = mediaUrl(settings.weddingBandVideo)

  return (
    <>
      <PageHero
        eyebrow="Weddings & Celebrations"
        title="Begin forever here"
        intro={settings.eventsIntro}
        imageUrl={mediaUrl(settings.eventsImage, 'hero')}
        imageAlt={mediaAlt(settings.eventsImage)}
        videoUrl={mediaUrl(settings.eventsVideo)}
      />

      {/* Story + stats */}
      <section className="container-luxe grid items-center gap-12 py-24 md:grid-cols-12 md:gap-10 md:py-36">
        <Reveal className="md:col-span-5" stagger>
          <p className="eyebrow text-gold">Your celebration</p>
          <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">
            {settings.weddingStoryHeading || 'Rituals honoured, every detail considered'}
          </h2>
          {settings.weddingStory && <p className="mt-8 leading-relaxed text-stone">{settings.weddingStory}</p>}
          {settings.weddingStats && settings.weddingStats.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/10 pt-8 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {settings.weddingStats.map((s) => (
                <div key={s.id} className="flex flex-col gap-1">
                  <dt className="field-label order-2">{s.label}</dt>
                  <dd className="display order-1 text-4xl text-gold">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <ParallaxImage
            src={mediaUrl(settings.weddingStoryImage, 'card')}
            alt={mediaAlt(settings.weddingStoryImage)}
            className="aspect-[4/5]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* Ceremonies */}
      {ceremonies.length > 0 && (
        <section className="bg-ink py-24 text-ivory md:py-36">
          <div className="container-luxe">
            <Reveal className="mb-14 max-w-2xl md:mb-20" stagger>
              <p className="eyebrow text-gold-light">Ceremonies</p>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Every tradition, beautifully kept</h2>
            </Reveal>
            <Reveal className="grid gap-12 md:grid-cols-3 md:gap-8" stagger>
              {ceremonies.map((c, i) => {
                const img = mediaUrl(c.image, 'card')
                return (
                  <article key={c.id} className={clsx(i === 1 && 'md:mt-16')}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {img && (
                        <Image src={img} alt={mediaAlt(c.image, c.title)} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                      )}
                      <span className="display absolute top-5 left-6 text-2xl text-ivory/80">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="display mt-6 text-3xl">{c.title}</h3>
                    <p className="mt-3 leading-relaxed text-ivory/70">{c.text}</p>
                  </article>
                )
              })}
            </Reveal>
          </div>
        </section>
      )}

      {/* Venues */}
      {venues.length > 0 && (
        <section className="container-luxe py-24 md:py-36">
          <Reveal className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:items-end" stagger>
            <div className="md:col-span-7">
              <p className="eyebrow text-gold">Venues</p>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Spaces for every scale</h2>
            </div>
            <p className="leading-relaxed text-stone md:col-span-4 md:col-start-9">
              From an intimate mehendi in the courtyard to a reception for 800 under the stars.
            </p>
          </Reveal>
          <div className="space-y-24 md:space-y-32">
            {venues.map((venue, i) => {
              const flip = i % 2 === 1
              const capacity = [
                { label: 'Area', value: venue.areaSqm && `${venue.areaSqm.toLocaleString()} m²` },
                { label: 'Banquet', value: venue.banquet },
                { label: 'Theatre', value: venue.theatre },
                { label: 'Reception', value: venue.reception },
              ].filter((c) => c.value)
              return (
                <article key={venue.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                  <ParallaxImage
                    src={mediaUrl(venue.image, 'card')}
                    video={mediaUrl(venue.video)}
                    alt={mediaAlt(venue.image, venue.name)}
                    className={clsx('aspect-[4/3] md:col-span-7', flip && 'md:order-2')}
                    sizes="(min-width: 768px) 58vw, 100vw"
                  />
                  <Reveal className={clsx('md:col-span-5', flip && 'md:order-1')} stagger>
                    <p className="eyebrow text-gold">{SETTING_LABEL[venue.setting]}</p>
                    <h3 className="display mt-4 text-[clamp(2rem,3.5vw,3rem)]">{venue.name}</h3>
                    <p className="mt-5 leading-relaxed text-stone">{venue.summary}</p>
                    <dl
                      className={clsx(
                        'mt-8 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10',
                        capacity.length === 3 && 'sm:grid-cols-3',
                        capacity.length >= 4 && 'sm:grid-cols-4',
                      )}
                    >
                      {capacity.map((c) => (
                        <div key={c.label} className="bg-ivory px-4 py-4">
                          <dt className="field-label">{c.label}</dt>
                          <dd className="display mt-1 text-2xl">{c.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Video band */}
      {(bandImage || bandVideo) && (
        <section className="relative">
          <ParallaxImage src={bandImage} video={bandVideo} alt="" className="h-[70svh] md:h-[85svh]" strength={18}>
            <div className="absolute inset-0 bg-ink/45" />
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-ivory">
              <Reveal>
                <p className="display mx-auto max-w-4xl text-[clamp(2rem,4.5vw,4rem)] italic">
                  &ldquo;{settings.weddingQuote || 'Two families, one celebration, a valley as witness.'}&rdquo;
                </p>
              </Reveal>
            </div>
          </ParallaxImage>
        </section>
      )}

      {/* Gallery preview */}
      {galleryImages.length > 0 && (
        <section className="container-luxe py-24 md:py-36">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold">Gallery</p>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Celebrations at the Crown</h2>
            </div>
            <Link href="/gallery?c=weddings" className="eyebrow link-underline pb-1">
              View wedding gallery
            </Link>
          </Reveal>
          <Reveal className="grid auto-rows-[38vw] grid-cols-2 gap-3 md:auto-rows-[17vw] md:grid-cols-4 md:gap-4" stagger>
            {galleryImages.map((m, i) => (
              <Link
                key={m.id}
                href="/gallery?c=weddings"
                className={clsx('group relative overflow-hidden', i === 0 && 'col-span-2 row-span-2')}
              >
                <Image
                  src={mediaUrl(m, i === 0 ? 'hero' : 'card')!}
                  alt={m.alt}
                  fill
                  sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                  className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                />
              </Link>
            ))}
          </Reveal>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section className="bg-sand py-24 md:py-36">
          <div className="container-luxe">
            <Reveal className="mb-14 text-center md:mb-20" stagger>
              <p className="eyebrow text-gold">Packages</p>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Thoughtfully curated</h2>
              <p className="mx-auto mt-5 max-w-xl text-stone">Every package is a starting point — our planners tailor each one.</p>
            </Reveal>
            <Reveal className="grid gap-6 md:grid-cols-3" stagger>
              {packages.map((p) => (
                <article
                  key={p.id}
                  className={clsx(
                    'relative flex flex-col border p-8 md:p-10',
                    p.highlight ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-ivory',
                  )}
                >
                  {p.highlight && <span className="eyebrow absolute -top-3 left-8 bg-gold px-3 py-1.5 text-ivory">Most loved</span>}
                  <h3 className="display text-4xl">{p.name}</h3>
                  {p.guests && <p className={clsx('field-label mt-2', p.highlight && 'text-ivory/60')}>{p.guests}</p>}
                  <p className="display mt-6 text-2xl text-gold">{p.priceFrom}</p>
                  <ul className={clsx('mt-8 flex-1 space-y-3 text-sm', p.highlight ? 'text-ivory/80' : 'text-stone')}>
                    {(p.inclusions ?? '')
                      .split('\n')
                      .filter(Boolean)
                      .map((line) => (
                        <li key={line} className="flex gap-3">
                          <span className="text-gold">—</span>
                          {line}
                        </li>
                      ))}
                  </ul>
                  <a href="#enquire" className={clsx('btn mt-10', p.highlight ? 'btn-gold' : 'btn-outline')}>
                    Enquire
                  </a>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Planner + enquiry */}
      <section id="enquire" className="container-luxe grid scroll-mt-24 gap-16 py-24 md:grid-cols-12 md:py-36">
        <Reveal className="md:col-span-4" stagger>
          <p className="eyebrow text-gold">Plan with us</p>
          <h2 className="display mt-6 text-5xl">Let&apos;s begin</h2>
          <p className="mt-6 leading-relaxed text-stone">
            Share a few details and your dedicated planner will reply within 24 hours with venue availability and ideas.
          </p>
          {settings.plannerName && (
            <div className="mt-10 flex items-center gap-5 border-t border-ink/10 pt-8">
              {mediaUrl(settings.plannerImage, 'thumb') && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                  <Image src={mediaUrl(settings.plannerImage, 'thumb')!} alt={settings.plannerName} fill sizes="80px" className="object-cover" />
                </div>
              )}
              <div className="text-sm">
                <p className="display text-2xl">{settings.plannerName}</p>
                <p className="field-label mt-1">Wedding planner</p>
                {settings.plannerPhone && <p className="mt-2 text-stone">{settings.plannerPhone}</p>}
                {settings.plannerEmail && (
                  <a href={`mailto:${settings.plannerEmail}`} className="link-underline text-stone">
                    {settings.plannerEmail}
                  </a>
                )}
              </div>
            </div>
          )}
        </Reveal>
        <Reveal className="md:col-span-7 md:col-start-6">
          <EnquiryForm defaultType="wedding" />
        </Reveal>
      </section>
    </>
  )
}
