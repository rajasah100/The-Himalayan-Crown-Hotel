import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/motion/Reveal'
import { formatDay } from '@/lib/dates'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getActiveOffers } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Exclusive packages and seasonal privileges when you book direct.',
}

export default async function OffersPage() {
  const offers = await getActiveOffers()

  return (
    <>
      <PageHero
        eyebrow="Privileges"
        title="Special Offers"
        intro="Seasonal packages and privileges, available only when you book direct."
        imageUrl={mediaUrl(offers[0]?.image, 'hero')}
        imageAlt={mediaAlt(offers[0]?.image)}
      />

      <section className="container-luxe py-28 md:py-40">
        {offers.length === 0 ? (
          <p className="text-center text-stone">New offers are coming soon.</p>
        ) : (
          <Reveal className="grid gap-x-10 gap-y-20 md:grid-cols-2" stagger>
            {offers.map((offer) => {
              const img = mediaUrl(offer.image, 'card')
              return (
                <article key={offer.id} className="group">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    {img && (
                      <Image
                        src={img}
                        alt={mediaAlt(offer.image, offer.title)}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                      />
                    )}
                    {offer.discountPercent ? (
                      <span className="eyebrow absolute top-5 left-5 bg-ivory px-3 py-2">
                        Save {offer.discountPercent}%
                      </span>
                    ) : null}
                  </div>
                  <h2 className="display mt-8 text-4xl">{offer.title}</h2>
                  <p className="mt-4 max-w-lg leading-relaxed text-stone">{offer.summary}</p>
                  {offer.validTo && <p className="field-label mt-4">Valid until {formatDay(offer.validTo)}</p>}
                  <Link href="/book" className="btn btn-outline mt-8">
                    Book this offer
                  </Link>
                </article>
              )
            })}
          </Reveal>
        )}
      </section>
    </>
  )
}
