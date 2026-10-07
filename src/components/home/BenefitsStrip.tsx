import { Reveal } from '@/components/motion/Reveal'

type Benefit = { id?: string | null; title: string; text?: string | null }

/** “Why book direct” strip directly under the hero. */
export function BenefitsStrip({ benefits }: { benefits: Benefit[] }) {
  if (benefits.length === 0) return null
  return (
    <section className="border-b border-ink/10 bg-ivory">
      <Reveal
        className="container-luxe grid grid-cols-2 divide-ink/10 py-8 md:grid-cols-4 md:divide-x md:py-10"
        stagger
        y={20}
      >
        {benefits.map((b, i) => (
          <div key={b.id ?? i} className="flex items-start gap-4 px-2 py-3 md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="display mt-0.5 text-lg text-gold">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="eyebrow text-[0.65rem] text-ink">{b.title}</p>
              {b.text && <p className="mt-1.5 text-xs leading-relaxed text-stone">{b.text}</p>}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
