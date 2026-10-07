import Image from 'next/image'
import Link from 'next/link'

import { EXPERIENCE_CATEGORIES } from '@/collections/Experiences'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Experience } from '@/payload-types'

const categoryLabel = (value: string) => EXPERIENCE_CATEGORIES.find((c) => c.value === value)?.label ?? value

/** Bento-style grid: one tall feature card plus smaller cards. */
export function ExperiencesRail({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null
  const [feature, ...rest] = experiences

  return (
    <section className="container-luxe py-24 md:py-36">
      <Reveal className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end" stagger>
        <div className="md:col-span-7">
          <p className="eyebrow text-gold">Experiences</p>
          <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Beyond the hotel walls</h2>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="leading-relaxed text-stone">
            Sunrise over Everest, a lamp-lit walk through Patan, a singing-bowl ritual in our spa — curated by our concierge.
          </p>
          <Link href="/experiences" className="eyebrow link-underline mt-6 inline-block pb-1">
            All experiences
          </Link>
        </div>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-5" stagger>
        {[feature, ...rest.slice(0, 4)].map((exp, i) => {
          const big = i === 0
          return (
            <Link
              key={exp.id}
              href={`/experiences#${exp.slug}`}
              className={
                big
                  ? 'group relative block aspect-[4/5] overflow-hidden md:col-span-2 md:row-span-2 md:aspect-auto'
                  : 'group relative block aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[340px]'
              }
            >
              <Image
                src={mediaUrl(exp.image, big ? 'hero' : 'card')!}
                alt={mediaAlt(exp.image, exp.title)}
                fill
                sizes={big ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'}
                className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-ivory md:inset-x-6 md:bottom-6">
                <p className="eyebrow text-[0.6rem] text-gold-light">
                  {categoryLabel(exp.category)}
                  {big && exp.duration && <> · {exp.duration}</>}
                </p>
                <h3 className={big ? 'display mt-3 text-4xl md:text-5xl' : 'display mt-2 text-2xl'}>{exp.title}</h3>
                {big && <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/80">{exp.summary}</p>}
              </div>
            </Link>
          )
        })}
      </Reveal>
    </section>
  )
}
