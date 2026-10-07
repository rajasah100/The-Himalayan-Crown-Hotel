import 'server-only'

import { sql } from '@payloadcms/db-postgres'
import { randomBytes } from 'crypto'
import type { Payload } from 'payload'

import { BOOKING_HOLD_MINUTES } from '@/collections/Bookings'
import type { Booking } from '@/payload-types'

import { availableRooms } from './availability'
import { nightsBetween } from './dates'

export type HoldInput = {
  roomTypeId: number
  checkIn: Date
  checkOut: Date
  rooms: number
  adults: number
  children: number
  guestName: string
  guestEmail: string
  guestPhone?: string
  guestCountry?: string
  specialRequests?: string
}

export class BookingError extends Error {}

const makeReference = () => `HC-${randomBytes(4).toString('hex').toUpperCase()}`

/**
 * Creates a pending booking that holds inventory for BOOKING_HOLD_MINUTES.
 *
 * Runs inside a Postgres transaction with an advisory lock per room type, so two guests
 * racing for the last room are serialised: the second one re-checks availability after
 * the first has committed and gets a BookingError instead of an overbooking.
 */
export async function createBookingHold(payload: Payload, input: HoldInput): Promise<Booking> {
  const nights = nightsBetween(input.checkIn, input.checkOut)
  if (nights < 1) throw new BookingError('Check-out must be after check-in.')
  if (nights > 30) throw new BookingError('Online bookings are limited to 30 nights.')

  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) throw new Error('Database transactions are not available.')
  const req = { transactionID }

  try {
    const session = (payload.db as unknown as { sessions: Record<string, { db: { execute: (q: unknown) => Promise<unknown> } }> })
      .sessions[String(transactionID)]
    await session.db.execute(sql`select pg_advisory_xact_lock(${7_771}, ${input.roomTypeId})`)

    const roomType = await payload.findByID({
      collection: 'room-types',
      id: input.roomTypeId,
      depth: 0,
      req,
    })

    const guestsPerRoom = Math.ceil(input.adults / input.rooms)
    if (guestsPerRoom > roomType.maxAdults) {
      throw new BookingError(`${roomType.name} sleeps up to ${roomType.maxAdults} adults per room.`)
    }

    const free = await availableRooms(payload, roomType, input, req)
    if (free < input.rooms) {
      throw new BookingError(
        free === 0
          ? `${roomType.name} is fully booked for these dates.`
          : `Only ${free} ${roomType.name} room(s) left for these dates.`,
      )
    }

    const booking = await payload.create({
      collection: 'bookings',
      req,
      overrideAccess: true,
      data: {
        reference: makeReference(),
        status: 'pending',
        paymentStatus: 'unpaid',
        roomType: roomType.id,
        checkIn: input.checkIn.toISOString(),
        checkOut: input.checkOut.toISOString(),
        rooms: input.rooms,
        adults: input.adults,
        children: input.children,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        guestCountry: input.guestCountry,
        specialRequests: input.specialRequests,
        totalAmount: roomType.baseRateUSD * nights * input.rooms,
        currency: 'USD',
        holdExpiresAt: new Date(Date.now() + BOOKING_HOLD_MINUTES * 60_000).toISOString(),
      },
    })

    await payload.db.commitTransaction(transactionID)
    return booking
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  }
}
