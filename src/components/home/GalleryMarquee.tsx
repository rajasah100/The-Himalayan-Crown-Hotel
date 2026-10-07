import Image from 'next/image'
import Link from 'next/link'

type Item = { id: number; src: string; alt: string; width: number; height: number }

function Row({ items, reverse }: { items: Item[]; reverse?: boolean }) {
  // Duplicate the row so the -50% translate loops seamlessly.
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden">
      <div
        className="flex shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${items.length * 7}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="relative h-[34vw] shrink-0 overflow-hidden md:h-[22vw] lg:h-[18vw]"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
            aria-hidden={i >= items.length}
          >
            <Image src={item.src} alt={i < items.length ? item.alt : ''} fill sizes="40vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two counter-scrolling photo rows linking to the gallery. */
export function GalleryMarquee({ items }: { items: Item[] }) {
  if (items.length < 4) return null
  const half = Math.ceil(items.length / 2)
  return (
    <section className="overflow-hidden py-24 md:py-36">
      <div className="container-luxe mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-gold">Gallery</p>
          <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">Moments at the Crown</h2>
        </div>
        <Link href="/gallery" className="eyebrow link-underline pb-1">
          Open the gallery
        </Link>
      </div>
      <Link href="/gallery" className="group block space-y-4" aria-label="Open the gallery">
        <Row items={items.slice(0, half)} />
        <Row items={items.slice(half)} reverse />
      </Link>
    </section>
  )
}
