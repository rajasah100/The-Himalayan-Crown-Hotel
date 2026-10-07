'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useActionState, useState } from 'react'

import { holdBooking } from '@/app/(frontend)/actions'
import { FieldError, FormMessage } from '@/components/forms/FormMessage'

export type ResultRoom = {
  id: number
  name: string
  summary: string
  imageUrl: string | null
  imageAlt: string
  maxAdults: number
  rate: number
  total: number
  available: number
}

type Props = {
  rooms: ResultRoom[]
  stay: { checkIn: string; checkOut: string; nights: number; adults: number; rooms: number }
}

export function RoomResults({ rooms, stay }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [state, action, pending] = useActionState(holdBooking, null)

  return (
    <div className="space-y-6">
      {rooms.map((room) => {
        const fits = room.maxAdults * stay.rooms >= stay.adults
        const bookable = room.available >= stay.rooms && fits
        const isSelected = selected === room.id

        return (
          <article
            key={room.id}
            className={clsx('border bg-ivory transition-colors duration-500', isSelected ? 'border-gold' : 'border-ink/10')}
          >
            <div className="grid gap-6 p-4 sm:grid-cols-[220px_1fr] md:p-6 lg:grid-cols-[280px_1fr_auto] lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden">
                {room.imageUrl && <Image src={room.imageUrl} alt={room.imageAlt} fill sizes="280px" className="object-cover" />}
              </div>
              <div>
                <h3 className="display text-3xl">{room.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{room.summary}</p>
                <p className="field-label mt-4">
                  Sleeps {room.maxAdults} ·{' '}
                  {room.available === 0
                    ? 'Sold out'
                    : room.available <= 3
                      ? `Only ${room.available} left`
                      : 'Available'}
                </p>
              </div>
              <div className="flex items-end justify-between gap-6 sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-end">
                <div className="lg:text-right">
                  <p className="display text-3xl">${room.total.toLocaleString()}</p>
                  <p className="text-xs text-stone">
                    {stay.nights} night{stay.nights > 1 ? 's' : ''} · {stay.rooms} room{stay.rooms > 1 ? 's' : ''} · ${room.rate}/night
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!bookable}
                  onClick={() => setSelected(isSelected ? null : room.id)}
                  className={clsx('btn', isSelected ? 'btn-outline' : 'btn-gold', 'disabled:cursor-not-allowed disabled:opacity-40')}
                >
                  {!fits ? 'Too many guests' : !bookable ? 'Unavailable' : isSelected ? 'Close' : 'Select'}
                </button>
              </div>
            </div>

            {isSelected && (
              <form action={action} className="grid gap-6 border-t border-ink/10 p-4 sm:grid-cols-2 md:p-6">
                <input type="hidden" name="roomTypeId" value={room.id} />
                <input type="hidden" name="checkIn" value={stay.checkIn} />
                <input type="hidden" name="checkOut" value={stay.checkOut} />
                <input type="hidden" name="rooms" value={stay.rooms} />
                <input type="hidden" name="adults" value={stay.adults} />
                <p className="eyebrow text-gold sm:col-span-2">Guest details</p>
                <label className="block">
                  <span className="field-label">Full name *</span>
                  <input name="guestName" className="field" autoComplete="name" required />
                  <FieldError state={state} name="guestName" />
                </label>
                <label className="block">
                  <span className="field-label">Email *</span>
                  <input name="guestEmail" type="email" className="field" autoComplete="email" required />
                  <FieldError state={state} name="guestEmail" />
                </label>
                <label className="block">
                  <span className="field-label">Phone</span>
                  <input name="guestPhone" type="tel" className="field" autoComplete="tel" />
                </label>
                <label className="block">
                  <span className="field-label">Country</span>
                  <input name="guestCountry" className="field" autoComplete="country-name" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="field-label">Special requests</span>
                  <textarea name="specialRequests" rows={2} className="field resize-none" />
                </label>
                <div className="space-y-4 sm:col-span-2">
                  <FormMessage state={state} />
                  <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
                    {pending ? 'Holding your room…' : 'Continue to payment'}
                  </button>
                </div>
              </form>
            )}
          </article>
        )
      })}
    </div>
  )
}
