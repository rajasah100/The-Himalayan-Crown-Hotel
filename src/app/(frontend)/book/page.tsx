import type { Metadata } from 'next'

import { BookingBar } from '@/components/booking/BookingBar'
import { type ResultRoom, RoomResults } from '@/components/booking/RoomResults'
import { availableRooms } from '@/lib/availability'
import { nightsBetween, parseDay, todayUTC } from '@/lib/dates'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { getRoomTypes } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Book your stay',
  robots: { index: false },
}

type Props = { searchParams: Promise<Record<string, string | undefined>> }

const clampInt = (value: string | undefined, min: number, max: number, fallback: number) => {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isNaN(n) ? fallback : Math.min(max, Math.max(min, n))
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams
  const checkIn = parseDay(params.checkIn)
  const checkOut = parseDay(params.checkOut)
  const adults = clampInt(params.adults, 1, 12, 2)
  const rooms = clampInt(params.rooms, 1, 4, 1)

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0
  const validSearch = checkIn && checkOut && checkIn >= todayUTC() && nights >= 1 && nights <= 30

  let results: ResultRoom[] = []
  if (validSearch) {
    const payload = await getPayloadClient()
    const roomTypes = await getRoomTypes()
    results = await Promise.all(
      roomTypes.map(async (rt) => ({
        id: rt.id,
        name: rt.name,
        summary: rt.summary,
        imageUrl: mediaUrl(rt.heroImage, 'thumb'),
        imageAlt: mediaAlt(rt.heroImage, rt.name),
        maxAdults: rt.maxAdults,
        rate: rt.baseRateUSD,
        total: rt.baseRateUSD * nights * rooms,
        available: await availableRooms(payload, rt, { checkIn, checkOut }),
      })),
    )
  }

  return (
    <div className="bg-sand pb-28">
      <div className="bg-ink pt-36 pb-16 text-ivory">
        <div className="container-luxe">
          <p className="eyebrow text-gold-light">Reservations</p>
          <h1 className="display mt-4 mb-10 text-[clamp(2.5rem,5vw,4.5rem)]">Book your stay</h1>
          <BookingBar initial={{ checkIn: params.checkIn, checkOut: params.checkOut, adults, rooms }} />
        </div>
      </div>

      <div className="container-luxe pt-14">
        {!params.checkIn ? (
          <p className="text-center text-stone">Choose your dates above to see available rooms and rates.</p>
        ) : !validSearch ? (
          <p className="text-center text-red-800">
            Please choose an arrival date from today and a stay of 1–30 nights.
          </p>
        ) : (
          <RoomResults
            rooms={results}
            stay={{ checkIn: params.checkIn!, checkOut: params.checkOut!, nights, adults, rooms }}
          />
        )}
      </div>
    </div>
  )
}
