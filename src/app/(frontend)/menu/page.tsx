import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { DISH_CATEGORIES } from '@/collections/Dishes'
import { PageHero } from '@/components/layout/PageHero'
import { MenuNav } from '@/components/menu/MenuNav'
import { Reveal } from '@/components/motion/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getDishes, getSiteSettings } from '@/lib/queries'
import type { Dish } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Newari feasts, Himalayan momo, Thakali thali and international favourites — our à la carte menu.',
}

const TAG_MARKS: Record<string, { mark: string; label: string }> = {
  signature: { mark: '★', label: 'Chef’s signature' },
  vegetarian: { mark: 'V', label: 'Vegetarian' },
  vegan: { mark: 'VG', label: 'Vegan' },
  spicy: { mark: '🌶', label: 'Spicy' },
  'gluten-free': { mark: 'GF', label: 'Gluten free' },
}

const npr = (n: number) => `Rs ${n.toLocaleString('en-IN')}`
const restaurantName = (d: Dish) => (typeof d.restaurant === 'object' && d.restaurant ? d.restaurant.name : null)

function DishRow({ dish }: { dish: Dish }) {
  const img = mediaUrl(dish.image, 'thumb')
  return (
    <li className="flex gap-5 py-6">
      {img && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
          <Image src={img} alt={mediaAlt(dish.image, dish.name)} fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="display text-2xl leading-tight">{dish.name}</h3>
          <span className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-ink/25" aria-hidden />
          <span className="display shrink-0 text-xl">{npr(dish.priceNPR)}</span>
        </div>
        {dish.localName && <p className="mt-0.5 text-sm text-gold">{dish.localName}</p>}
        {dish.description && <p className="mt-2 text-sm leading-relaxed text-stone">{dish.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {dish.tags?.map((t) => (
            <span
              key={t}
              title={TAG_MARKS[t]?.label}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-ink/15 px-1.5 text-[0.6rem] font-semibold tracking-wider"
            >
              {TAG_MARKS[t]?.mark}
            </span>
          ))}
          {restaurantName(dish) && <span className="field-label ml-1">{restaurantName(dish)}</span>}
        </div>
      </div>
    </li>
  )
}

export default async function MenuPage() {
  const [dishes, settings] = await Promise.all([getDishes(), getSiteSettings()])

  const signatures = dishes.filter((d) => d.tags?.includes('signature') && d.image).slice(0, 3)
  const sections = DISH_CATEGORIES.map((c) => ({ ...c, dishes: dishes.filter((d) => d.category === c.value) })).filter(
    (s) => s.dishes.length > 0,
  )

  return (
    <>
      <PageHero
        eyebrow="Menu"
        title="From the Kitchen"
        intro={settings.menuIntro}
        imageUrl={mediaUrl(settings.menuImage, 'hero')}
        imageAlt={mediaAlt(settings.menuImage)}
        videoUrl={mediaUrl(settings.menuVideo)}
      />

      {signatures.length > 0 && (
        <section className="container-luxe py-24 md:py-32">
          <Reveal className="mb-14 text-center" stagger>
            <p className="eyebrow text-gold">Chef’s signatures</p>
            <h2 className="display mt-5 text-[clamp(2.25rem,4vw,3.5rem)]">Dishes we are known for</h2>
          </Reveal>
          <Reveal className="grid gap-10 md:grid-cols-3 md:gap-8" stagger>
            {signatures.map((dish) => (
              <article key={dish.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={mediaUrl(dish.image, 'card')!}
                    alt={mediaAlt(dish.image, dish.name)}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                  />
                  <span className="eyebrow absolute top-5 left-5 bg-ivory px-3 py-2">{npr(dish.priceNPR)}</span>
                </div>
                <h3 className="display mt-6 text-3xl">{dish.name}</h3>
                {dish.localName && <p className="mt-1 text-sm text-gold">{dish.localName}</p>}
                <p className="mt-3 leading-relaxed text-stone">{dish.description}</p>
              </article>
            ))}
          </Reveal>
        </section>
      )}

      <MenuNav sections={sections.map((s) => ({ id: s.value, label: s.label }))} />

      <div className="bg-sand/50">
        <div className="container-luxe max-w-5xl py-20 md:py-28">
          {sections.map((section) => (
            <section key={section.value} id={section.value} className="scroll-mt-40 pb-16 last:pb-0 md:pb-24">
              <Reveal>
                <h2 className="display text-center text-[clamp(2rem,3.5vw,3rem)]">{section.label}</h2>
                <div className="mx-auto mt-4 mb-6 h-px w-16 bg-gold" />
              </Reveal>
              <ul className="grid divide-y divide-ink/10 md:grid-cols-2 md:gap-x-14 md:divide-y-0">
                {section.dishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} />
                ))}
              </ul>
            </section>
          ))}

          <div className="mt-16 border-t border-ink/10 pt-10 text-center">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-stone">
              {Object.values(TAG_MARKS).map((t) => (
                <li key={t.label}>
                  <span className="font-semibold text-ink">{t.mark}</span> {t.label}
                </li>
              ))}
            </ul>
            {settings.menuNote && <p className="mt-4 text-xs text-stone">{settings.menuNote}</p>}
            <p className="mt-2 text-xs text-stone">Please let us know about any allergies — our chefs are happy to adapt.</p>
            <Link href="/contact?type=dining" className="btn btn-gold mt-10">
              Reserve a table
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
