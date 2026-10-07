import Link from 'next/link'

import { ParallaxImage } from '@/components/motion/ParallaxImage'
import { Reveal } from '@/components/motion/Reveal'

type Props = {
  imageUrl: string | null
  videoUrl?: string | null
  alt: string
  intro?: string | null
  stats: { id?: string | null; value: string; label: string }[]
}

export function WeddingFeature({ imageUrl, videoUrl, alt, intro, stats }: Props) {
  return (
    <section className="bg-ink text-ivory">
      <div className="grid lg:min-h-svh lg:grid-cols-2">
        <ParallaxImage
          src={imageUrl}
          video={videoUrl}
          alt={alt}
          className="aspect-[4/3] lg:aspect-auto lg:h-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
          strength={10}
        />
        <div className="flex items-center px-[clamp(1rem,4vw,3.5rem)] py-20 lg:px-20">
          <Reveal stagger>
            <p className="eyebrow text-gold-light">Weddings &amp; Celebrations</p>
            <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">Begin forever beneath the Himalaya</h2>
            {intro && <p className="mt-8 max-w-lg leading-relaxed text-ivory/75">{intro}</p>}
            {stats.length > 0 && (
              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-ivory/15 pt-8 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={s.id ?? i} className="flex flex-col gap-1">
                    <dt className="field-label order-2 text-ivory/60">{s.label}</dt>
                    <dd className="display order-1 text-3xl text-gold-light">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/weddings" className="btn btn-gold">
                Explore weddings
              </Link>
              <Link
                href="/weddings#enquire"
                className="btn btn-outline border-ivory/50 hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                Plan with us
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
