import type { ServerProps, Where } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { Booking } from '@/payload-types'

import { type OccupancyDay, OccupancyChart } from './OccupancyChart'

const DAY = 86_400_000
const TZ = 'Asia/Kathmandu'

/** Today's date in Kathmandu as a UTC-midnight Date (bookings store dates that way). */
const todayKathmandu = () => new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())}T00:00:00.000Z`)

const fmtDay = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const STATUS_LABEL: Record<string, string> = {
  pending: 'On hold',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  expired: 'Expired',
}

function Kpi({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string }) {
  const body = (
    <>
      <span className="hc-kpi__label">{label}</span>
      <span className="hc-kpi__value">{value}</span>
      {hint && <span className="hc-kpi__hint">{hint}</span>}
    </>
  )
  return href ? (
    <Link className="hc-kpi hc-kpi--link" href={href}>
      {body}
    </Link>
  ) : (
    <div className="hc-kpi">{body}</div>
  )
}

export async function Dashboard({ payload, user }: ServerProps) {
  const roles = (user as { roles?: string[] } | undefined)?.roles ?? []
  const seesBookings = roles.includes('admin') || roles.includes('reservations')
  const name = (user as { name?: string } | undefined)?.name?.split(' ')[0] || 'team'

  const today = todayKathmandu()
  const horizonEnd = new Date(today.getTime() + 14 * DAY)
  const nowIso = new Date().toISOString()
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).toISOString()

  const activeWhere: Where = {
    or: [
      { status: { equals: 'confirmed' } },
      { and: [{ status: { equals: 'pending' } }, { holdExpiresAt: { greater_than: nowIso } }] },
    ],
  }

  const [roomTypes, upcoming, recent, monthConfirmed, holds, enquiries, newEnquiryCount, subscribers] = await Promise.all([
    payload.find({ collection: 'room-types', depth: 0, pagination: false, select: { totalRooms: true } }),
    seesBookings
      ? payload.find({
          collection: 'bookings',
          depth: 0,
          pagination: false,
          select: { checkIn: true, checkOut: true, rooms: true },
          where: {
            and: [
              activeWhere,
              { checkIn: { less_than: horizonEnd.toISOString() } },
              { checkOut: { greater_than: today.toISOString() } },
            ],
          },
        })
      : null,
    seesBookings ? payload.find({ collection: 'bookings', depth: 1, limit: 8, sort: '-createdAt' }) : null,
    seesBookings
      ? payload.find({
          collection: 'bookings',
          depth: 0,
          pagination: false,
          select: { totalAmount: true, currency: true },
          where: { and: [{ status: { equals: 'confirmed' } }, { createdAt: { greater_than_equal: monthStart } }] },
        })
      : null,
    seesBookings
      ? payload.count({
          collection: 'bookings',
          where: { and: [{ status: { equals: 'pending' } }, { holdExpiresAt: { greater_than: nowIso } }] },
        })
      : null,
    payload.find({ collection: 'enquiries', depth: 0, limit: 5, sort: '-createdAt' }),
    payload.count({ collection: 'enquiries', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'subscribers' }),
  ])

  const totalRooms = roomTypes.docs.reduce((sum, r) => sum + (r.totalRooms ?? 0), 0)
  const bookings = upcoming?.docs ?? []

  // Rooms sold per night for the next 14 nights.
  const days: OccupancyDay[] = Array.from({ length: 14 }, (_, i) => {
    const night = new Date(today.getTime() + i * DAY)
    const rooms = bookings
      .filter((b) => new Date(b.checkIn) <= night && new Date(b.checkOut) > night)
      .reduce((s, b) => s + (b.rooms ?? 1), 0)
    return {
      date: night.toISOString().slice(0, 10),
      label: night.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
      weekday: night.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }),
      rooms,
      total: totalRooms,
    }
  })

  const sameDay = (a: string, b: Date) => new Date(a).getTime() === b.getTime()
  const arrivals = bookings.filter((b) => sameDay(b.checkIn, today)).reduce((s, b) => s + (b.rooms ?? 1), 0)
  const departures = bookings.filter((b) => sameDay(b.checkOut, today)).reduce((s, b) => s + (b.rooms ?? 1), 0)
  const tonight = days[0]?.rooms ?? 0
  const occupancy = totalRooms ? Math.round((tonight / totalRooms) * 100) : 0
  const revenue = (monthConfirmed?.docs ?? []).filter((b) => b.currency === 'USD').reduce((s, b) => s + (b.totalAmount ?? 0), 0)
  const greeting = (() => {
    const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  return (
    <div className="hc-dash">
      <header className="hc-dash__head">
        <div>
          <p className="hc-eyebrow">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ })} · Kathmandu
          </p>
          <h1 className="hc-dash__title">
            {greeting}, {name}
          </h1>
        </div>
        <div className="hc-dash__actions">
          {seesBookings && (
            <Link className="hc-btn" href="/admin/collections/bookings">
              All bookings
            </Link>
          )}
          <Link className="hc-btn hc-btn--ghost" href="/" target="_blank" rel="noreferrer">
            View website ↗
          </Link>
        </div>
      </header>

      {seesBookings && (
        <>
          <section className="hc-kpis">
            <Kpi label="Arrivals today" value={arrivals} hint="rooms" />
            <Kpi label="Departures today" value={departures} hint="rooms" />
            <Kpi label="In-house tonight" value={`${tonight} / ${totalRooms}`} hint="rooms occupied" />
            <Kpi label="Occupancy tonight" value={`${occupancy}%`} />
            <Kpi label="On hold" value={holds?.totalDocs ?? 0} hint="awaiting payment" href="/admin/collections/bookings?where[status][equals]=pending" />
            <Kpi label="Revenue this month" value={usd(revenue)} hint="confirmed, USD" />
          </section>

          <section className="hc-card">
            <div className="hc-card__head">
              <h2>Occupancy — next 14 nights</h2>
              <span className="hc-muted">{totalRooms} rooms on sale</span>
            </div>
            <OccupancyChart days={days} />
          </section>
        </>
      )}

      <div className="hc-grid">
        {seesBookings && (
          <section className="hc-card hc-grid__wide">
            <div className="hc-card__head">
              <h2>Latest bookings</h2>
              <Link href="/admin/collections/bookings">View all →</Link>
            </div>
            {recent && recent.docs.length > 0 ? (
              <table className="hc-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Stay</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.docs as Booking[]).map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link href={`/admin/collections/bookings/${b.id}`}>{b.reference}</Link>
                      </td>
                      <td>{b.guestName}</td>
                      <td>{typeof b.roomType === 'object' ? b.roomType.name : '—'}</td>
                      <td>
                        {fmtDay(b.checkIn)} – {fmtDay(b.checkOut)}
                      </td>
                      <td>
                        {b.currency} {b.totalAmount.toLocaleString()}
                      </td>
                      <td>
                        <span className={`hc-pill hc-pill--${b.status}`}>{STATUS_LABEL[b.status] ?? b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="hc-muted">No bookings yet.</p>
            )}
          </section>
        )}

        <section className="hc-card">
          <div className="hc-card__head">
            <h2>
              Enquiries {newEnquiryCount.totalDocs > 0 && <span className="hc-badge">{newEnquiryCount.totalDocs} new</span>}
            </h2>
            <Link href="/admin/collections/enquiries">View all →</Link>
          </div>
          {enquiries.docs.length > 0 ? (
            <ul className="hc-list">
              {enquiries.docs.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/collections/enquiries/${e.id}`}>
                    <strong>{e.name}</strong>
                    <span className="hc-muted">
                      {e.type} · {fmtDay(e.createdAt)}
                    </span>
                  </Link>
                  {e.status === 'new' && <span className="hc-pill hc-pill--pending">New</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="hc-muted">No enquiries yet.</p>
          )}
        </section>

        <section className="hc-card">
          <div className="hc-card__head">
            <h2>Quick actions</h2>
          </div>
          <ul className="hc-links">
            <li>
              <Link href="/admin/globals/site-settings">Edit home page &amp; contact details</Link>
            </li>
            <li>
              <Link href="/admin/collections/room-types">Rooms, rates &amp; inventory</Link>
            </li>
            <li>
              <Link href="/admin/collections/dishes/create">Add a dish to the menu</Link>
            </li>
            <li>
              <Link href="/admin/collections/offers/create">Create a special offer</Link>
            </li>
            <li>
              <Link href="/admin/collections/media/create">Upload photos or video</Link>
            </li>
            <li>
              <Link href="/admin/collections/testimonials">Guest reviews</Link>
            </li>
          </ul>
          <p className="hc-muted hc-small">{subscribers.totalDocs} newsletter subscribers</p>
        </section>
      </div>
    </div>
  )
}
