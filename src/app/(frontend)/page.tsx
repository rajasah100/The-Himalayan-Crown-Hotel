import Image from 'next/image'
import Link from 'next/link'

import { BenefitsStrip } from '@/components/home/BenefitsStrip'
import { ExperiencesRail } from '@/components/home/ExperiencesRail'
import { GalleryMarquee } from '@/components/home/GalleryMarquee'
import { Hero } from '@/components/home/Hero'
import { LocationSection } from '@/components/home/LocationSection'
import { Reviews } from '@/components/home/Reviews'
import { RoomsShowcase } from '@/components/home/RoomsShowcase'
import { WeddingFeature } from '@/components/home/WeddingFeature'
import { BackgroundVideo } from '@/components/media/BackgroundVideo'
import { ParallaxImage } from '@/components/motion/ParallaxImage'
import { Reveal } from '@/components/motion/Reveal'
import { isMedia, mediaAlt, mediaUrl } from '@/lib/media'
import {
  getActiveOffers,
  getDining,
  getDishes,
  getExperiences,
  getGalleryMedia,
  getRoomTypes,
  getSiteSettings,
  getTestimonials,
} from '@/lib/queries'
import { getCurrentWeather } from '@/lib/weather'

export default async function HomePage() {
  const [settings, rooms, dining, offers, dishes, experiences, reviews, galleryMedia] = await Promise.all([
    getSiteSettings(),
    getRoomTypes({ featured: true }),
    getDining(),
    getActiveOffers(),
    getDishes(),
    getExperiences({ featured: true }),
    getTestimonials(),
    getGalleryMedia(),
  ])
  const weather = await getCurrentWeather(settings.latitude ?? undefined, settings.longitude ?? undefined)

  const signatureDishes = dishes.filter((d) => d.tags?.includes('signature') && d.image).slice(0, 3)
  const marqueeItems = galleryMedia
    .filter((m) => m.mimeType?.startsWith('image') && m.url)
    .slice(0, 14)
    .map((m) => ({ id: m.id, src: mediaUrl(m, 'card')!, alt: m.alt, width: m.width || 4, height: m.height || 3 }))

  const signatureDining = dining.slice(0, 2)
  const ctaImage = mediaUrl(settings.ctaImage, 'hero')
  const ctaVideo = mediaUrl(settings.ctaVideo)
  const introCaption = [settings.introVideo, settings.introImage].find(isMedia)?.caption

  return (
    <>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        day={{
          imageUrl: mediaUrl(settings.heroImage, 'hero'),
          videoUrl: mediaUrl(settings.heroVideo),
          alt: mediaAlt(settings.heroImage),
        }}
        night={
          settings.heroNightImage
            ? {
                imageUrl: mediaUrl(settings.heroNightImage, 'hero'),
                videoUrl: mediaUrl(settings.heroNightVideo),
                alt: mediaAlt(settings.heroNightImage),
              }
            : null
        }
        filmUrl={mediaUrl(settings.filmVideo)}
        weather={weather}
      />

      <BenefitsStrip benefits={settings.benefits ?? []} />

      {/* Welcome */}
      <section className="container-luxe grid items-center gap-12 py-24 md:grid-cols-12 md:gap-10 md:py-36">
        <Reveal className="md:col-span-5 lg:col-span-4" stagger>
          <p className="eyebrow text-gold">Welcome</p>
          <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">
            {settings.introHeading || 'A quiet kingdom above the valley'}
          </h2>
          {settings.introBody && <p className="mt-8 leading-relaxed text-stone">{settings.introBody}</p>}
          <div>
            <Link href="/rooms" className="btn btn-outline mt-10">
              Discover the hotel
            </Link>
          </div>
        </Reveal>
        <div className="md:col-span-7 lg:col-start-6">
          <ParallaxImage
            src={mediaUrl(settings.introImage, 'card')}
            video={mediaUrl(settings.introVideo)}
            alt={mediaAlt(settings.introImage)}
            className="aspect-[4/3] md:aspect-[5/4]"
            position="65% 80%"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
          {introCaption && <p className="mt-4 text-xs tracking-wide text-stone">{introCaption}</p>}
        </div>
      </section>

      {rooms.length > 0 && (
        <RoomsShowcase
          rooms={rooms.map((r) => ({
            slug: r.slug!,
            name: r.name,
            tagline: r.tagline,
            sizeSqm: r.sizeSqm,
            view: r.view,
            rate: r.baseRateUSD,
            imageUrl: mediaUrl(r.heroImage, 'card'),
            imageAlt: mediaAlt(r.heroImage, r.name),
            videoUrl: mediaUrl(r.video),
          }))}
        />
      )}

      {/* Dining */}
      <section className="container-luxe py-24 md:py-36">
        <Reveal className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end" stagger>
          <div className="md:col-span-7">
            <p className="eyebrow text-gold">Dine</p>
            <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Flavours of the Himalaya and beyond</h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="leading-relaxed text-stone">
              Three kitchens, one philosophy: honest Himalayan produce, cooked with ceremony.
            </p>
            <div className="mt-6 flex gap-8">
              <Link href="/dining" className="eyebrow link-underline pb-1">
                Restaurants &amp; bars
              </Link>
              <Link href="/menu" className="eyebrow link-underline pb-1">
                View the menu
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-16 md:grid-cols-2 md:gap-10">
          {signatureDining.map((venue, i) => (
            <Reveal key={venue.id} className={i === 1 ? 'md:mt-24' : undefined} delay={i * 0.1}>
              <ParallaxImage
                src={mediaUrl(venue.image, 'card')}
                video={mediaUrl(venue.video)}
                alt={mediaAlt(venue.image, venue.name)}
                className="aspect-[4/3]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="display text-4xl">{venue.name}</h3>
                <p className="eyebrow shrink-0 text-stone">{venue.cuisine}</p>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-stone">{venue.summary}</p>
            </Reveal>
          ))}
        </div>

        {signatureDishes.length > 0 && (
          <div className="mt-20 border-t border-ink/10 pt-14 md:mt-28">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <p className="display text-3xl md:text-4xl">From our menu</p>
              <Link href="/menu" className="eyebrow link-underline pb-1">
                View the full menu
              </Link>
            </Reveal>
            <Reveal className="grid gap-8 sm:grid-cols-3" stagger>
              {signatureDishes.map((dish) => (
                <Link key={dish.id} href="/menu" className="group flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={mediaUrl(dish.image, 'thumb')!}
                      alt={mediaAlt(dish.image, dish.name)}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="display text-2xl leading-tight">{dish.name}</p>
                    {dish.localName && <p className="text-sm text-gold">{dish.localName}</p>}
                    <p className="mt-1 text-xs text-stone">Rs {dish.priceNPR.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        )}
      </section>

      {/* Full-bleed quote band */}
      <section className="relative">
        <ParallaxImage
          src={mediaUrl(settings.quoteImage, 'hero')}
          video={mediaUrl(settings.quoteVideo)}
          alt=""
          className="h-[70svh] md:h-[85svh]"
          strength={20}
        >
          <div className="absolute inset-0 bg-ink/50" />
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-ivory">
            <Reveal>
              <p className="display mx-auto max-w-4xl text-[clamp(2rem,4.5vw,4rem)] italic">
                &ldquo;{settings.quoteText || 'Atithi Devo Bhava — the guest is god.'}&rdquo;
              </p>
              {settings.quoteCaption && <p className="eyebrow mt-8 text-gold-light">{settings.quoteCaption}</p>}
            </Reveal>
          </div>
        </ParallaxImage>
      </section>

      {/* Breathing room between the two dark, full-bleed sections */}
      <div className="pt-20 md:pt-32">
        <WeddingFeature
          imageUrl={mediaUrl(settings.eventsImage, 'hero')}
          videoUrl={mediaUrl(settings.eventsVideo)}
          alt={mediaAlt(settings.eventsImage)}
          intro={settings.eventsIntro}
          stats={(settings.weddingStats ?? []).slice(0, 4)}
        />
      </div>

      <ExperiencesRail experiences={experiences} />

      {/* Offers */}
      {offers.length > 0 && (
        <section className="bg-sand py-24 md:py-36">
          <div className="container-luxe">
            <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
              <div>
                <p className="eyebrow text-gold">Privileges</p>
                <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Special offers</h2>
              </div>
              <Link href="/offers" className="eyebrow link-underline pb-1">
                View all offers
              </Link>
            </Reveal>
            <Reveal className="grid gap-12 md:grid-cols-3 md:gap-8" stagger>
              {offers.slice(0, 3).map((offer) => {
                const img = mediaUrl(offer.image, 'card')
                return (
                  <Link key={offer.id} href="/offers" className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {img && (
                        <Image
                          src={img}
                          alt={mediaAlt(offer.image, offer.title)}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                        />
                      )}
                      {offer.discountPercent ? (
                        <span className="eyebrow absolute top-5 left-5 bg-ivory px-3 py-2 text-ink">
                          Save {offer.discountPercent}%
                        </span>
                      ) : null}
                    </div>
                    <h3 className="display mt-6 text-3xl">{offer.title}</h3>
                    <p className="mt-3 leading-relaxed text-stone">{offer.summary}</p>
                  </Link>
                )
              })}
            </Reveal>
          </div>
        </section>
      )}

      <Reviews
        reviews={reviews}
        rating={settings.ratingValue ? { value: settings.ratingValue, count: settings.ratingCount, source: settings.ratingSource } : null}
        imageUrl={mediaUrl(settings.reviewsImage, 'hero')}
        imageAlt={mediaAlt(settings.reviewsImage)}
      />

      <GalleryMarquee items={marqueeItems} />

      <LocationSection
        address={settings.address}
        latitude={settings.latitude}
        longitude={settings.longitude}
        mapUrl={settings.mapUrl}
        imageUrl={mediaUrl(settings.locationImage, 'card')}
        imageAlt={mediaAlt(settings.locationImage)}
        distances={settings.distances ?? []}
      />

      {/* CTA over video */}
      <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink text-ivory">
        {ctaVideo ? (
          <BackgroundVideo src={ctaVideo} poster={ctaImage} />
        ) : (
          ctaImage && <Image src={ctaImage} alt="" fill sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/40 to-ink/80" />
        <div className="container-luxe relative py-24 text-center">
          <Reveal stagger>
            <p className="eyebrow text-gold-light">Reserve</p>
            <h2 className="display mx-auto mt-6 max-w-3xl text-[clamp(2.5rem,5.5vw,5rem)]">
              Your Himalayan story begins here
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-ivory/80">
              Book direct for our best available rate, daily breakfast and a complimentary airport transfer.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="btn btn-gold">
                Check availability
              </Link>
              <Link href="/weddings" className="btn btn-outline border-ivory/60 hover:border-ivory hover:bg-ivory hover:text-ink">
                Plan an event
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
