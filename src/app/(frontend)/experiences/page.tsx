import clsx from 'clsx'
import type { Metadata } from 'next'
import Link from 'next/link'

import { EXPERIENCE_CATEGORIES } from '@/collections/Experiences'
import { PageHero } from '@/components/layout/PageHero'
import { ParallaxImage } from '@/components/motion/ParallaxImage'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getExperiences } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Experiences & Spa',
  description: 'Everest mountain flights, heritage walks in Patan and Bhaktapur, singing-bowl rituals and Himalayan spa therapies.',
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences()
  const hero = experiences.find((e) => e.category === 'adventure') ?? experiences[0]
  const groups = EXPERIENCE_CATEGORIES.map((c) => ({ ...c, items: experiences.filter((e) => e.category === c.value) })).filter(
    (g) => g.items.length > 0,
  )

  return (
    <>
      <PageHero
        eyebrow="Experiences & Spa"
        title="Discover the valley"
        intro="Curated by our concierge: heritage, adventure and the healing traditions of the Himalaya."
        imageUrl={mediaUrl(hero?.image, 'hero')}
        imageAlt={mediaAlt(hero?.image)}
        videoUrl={mediaUrl(hero?.video)}
      />

      <nav className="sticky top-[68px] z-30 border-b border-ink/10 bg-ivory/95 backdrop-blur-md" aria-label="Experience categories">
        <div className="container-luxe flex gap-8 overflow-x-auto py-4 [scrollbar-width:none] md:justify-center">
          {groups.map((g) => (
            <a key={g.value} href={`#${g.value}`} className="eyebrow shrink-0 text-stone hover:text-gold">
              {g.label}
            </a>
          ))}
        </div>
      </nav>

      {groups.map((group, gi) => (
        <section
          key={group.value}
          id={group.value}
          className={clsx('scroll-mt-32 py-24 md:py-32', gi % 2 === 1 && 'bg-sand')}
        >
          <div className="container-luxe">
            <Reveal className="mb-14 text-center md:mb-20" stagger>
              <p className="eyebrow text-gold">{String(gi + 1).padStart(2, '0')}</p>
              <h2 className="display mt-4 text-[clamp(2.25rem,4vw,3.5rem)]">{group.label}</h2>
            </Reveal>
            <div className="space-y-24 md:space-y-32">
              {group.items.map((exp, i) => {
                const flip = i % 2 === 1
                return (
                  <article key={exp.id} id={exp.slug ?? undefined} className="grid scroll-mt-32 items-center gap-10 md:grid-cols-12 md:gap-14">
                    <ParallaxImage
                      src={mediaUrl(exp.image, 'card')}
                      video={mediaUrl(exp.video)}
                      alt={mediaAlt(exp.image, exp.title)}
                      className={clsx('aspect-[4/3] md:col-span-7', flip && 'md:order-2')}
                      sizes="(min-width: 768px) 58vw, 100vw"
                    />
                    <Reveal className={clsx('md:col-span-5', flip && 'md:order-1')} stagger>
                      <p className="eyebrow text-gold">{exp.duration}</p>
                      <h3 className="display mt-4 text-[clamp(2rem,3.5vw,3rem)]">{exp.title}</h3>
                      <p className="mt-5 leading-relaxed text-stone">{exp.summary}</p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mt-6 space-y-2 text-sm text-stone">
                          {exp.highlights.map((h) => (
                            <li key={h.id} className="flex gap-3">
                              <span className="text-gold">—</span>
                              {h.text}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-8 flex flex-wrap items-center gap-6">
                        <Link href={`/contact?type=${group.value === 'wellness' ? 'spa' : 'general'}`} className="btn btn-outline">
                          {group.value === 'wellness' ? 'Book a treatment' : 'Arrange with concierge'}
                        </Link>
                        {exp.priceFrom && <p className="text-sm text-stone">{exp.priceFrom}</p>}
                      </div>
                    </Reveal>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
