import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDay, nightsBetween } from '@/lib/dates'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Reservation', robots: { index: false } }

type Props = { searchParams: Promise<{ ref?: string }> }

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams
  if (!ref || !/^HC-[0-9A-F]{8}$/.test(ref)) notFound()

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'bookings',
    overrideAccess: true,
    depth: 1,
    limit: 1,
    where: { reference: { equals: ref } },
  })
  const booking = docs[0]
  if (!booking) notFound()

  const roomName = typeof booking.roomType === 'object' ? booking.roomType.name : 'Room'
  const nights = nightsBetween(new Date(booking.checkIn), new Date(booking.checkOut))
  const holdActive = booking.status === 'pending' && booking.holdExpiresAt && new Date(booking.holdExpiresAt) > new Date()

  return (
    <div className="bg-sand pt-36 pb-28">
      <div className="container-luxe max-w-3xl">
        <p className="eyebrow text-gold">Reservation {booking.reference}</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,5vw,4rem)]">
          {booking.status === 'confirmed' ? 'Your stay is confirmed' : holdActive ? 'Your room is on hold' : 'Hold expired'}
        </h1>

        <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10 bg-ivory px-6">
          {[
            ['Guest', booking.guestName],
            ['Room', `${roomName} × ${booking.rooms}`],
            ['Arrival', formatDay(booking.checkIn)],
            ['Departure', formatDay(booking.checkOut)],
            ['Nights', String(nights)],
            ['Guests', `${booking.adults} adult${booking.adults > 1 ? 's' : ''}`],
            ['Total', `${booking.currency} ${booking.totalAmount.toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-4 text-sm">
              <dt className="field-label">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {holdActive && (
          <div className="mt-10 border-l-2 border-gold bg-ivory p-6">
            <p className="text-sm leading-relaxed">
              We&apos;re holding this room until{' '}
              <strong>
                {new Date(booking.holdExpiresAt!).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Asia/Kathmandu',
                })}{' '}
                (Nepal time)
              </strong>
              . Complete payment to confirm.
            </p>
            {/* Phase 2: eSewa / Khalti / card gateway buttons go here. */}
            <div className="mt-6 flex flex-wrap gap-3">
              {['eSewa', 'Khalti', 'Card'].map((m) => (
                <button key={m} type="button" disabled className="btn btn-outline opacity-50" title="Payment gateway coming in phase 2">
                  Pay with {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <Link href="/" className="eyebrow link-underline mt-12 inline-block pb-1">
          Back to home
        </Link>
      </div>
    </div>
  )
}
