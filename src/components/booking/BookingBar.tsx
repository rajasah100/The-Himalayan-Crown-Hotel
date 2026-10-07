'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

const isoDay = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

type Props = {
  initial?: { checkIn?: string; checkOut?: string; adults?: number; rooms?: number }
  tone?: 'glass' | 'solid'
}

export function BookingBar({ initial, tone = 'glass' }: Props) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? isoDay(1))
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? isoDay(3))
  const [adults, setAdults] = useState(initial?.adults ?? 2)
  const [rooms, setRooms] = useState(initial?.rooms ?? 1)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ checkIn, checkOut, adults: String(adults), rooms: String(rooms) })
    router.push(`/book?${params}`)
  }

  const onCheckInChange = (value: string) => {
    setCheckIn(value)
    if (value >= checkOut) {
      const next = new Date(`${value}T00:00:00`)
      next.setDate(next.getDate() + 1)
      setCheckOut(next.toLocaleDateString('en-CA'))
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        'grid grid-cols-2 gap-x-6 gap-y-4 p-5 md:grid-cols-[1fr_1fr_0.7fr_0.7fr_auto] md:items-end md:p-6',
        tone === 'glass'
          ? 'border border-ivory/20 bg-ink/30 text-ivory backdrop-blur-md'
          : 'border border-ink/10 bg-ivory text-ink',
      )}
    >
      <label className="block">
        <span className="field-label">Arrival</span>
        <input
          type="date"
          className={clsx('field', tone === 'glass' && '[color-scheme:dark]')}
          min={isoDay(0)}
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="field-label">Departure</span>
        <input
          type="date"
          className={clsx('field', tone === 'glass' && '[color-scheme:dark]')}
          min={checkIn}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="field-label">Adults</span>
        <select className="field" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="text-ink">
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="field-label">Rooms</span>
        <select className="field" value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n} className="text-ink">
              {n}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-gold col-span-2 md:col-span-1">
        Check availability
      </button>
    </form>
  )
}
