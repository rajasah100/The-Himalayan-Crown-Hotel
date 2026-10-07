import 'server-only'

import type { Payload, PayloadRequest } from 'payload'

import type { RoomType } from '@/payload-types'

import { addDays, nightsBetween, toDayString } from './dates'

type Range = { checkIn: Date; checkOut: Date }

/**
 * Rooms of `roomType` still sellable for every night in [checkIn, checkOut).
 * Confirmed bookings and unexpired pending holds both consume inventory.
 */
export async function availableRooms(
  payload: Payload,
  roomType: Pick<RoomType, 'id' | 'totalRooms'>,
  { checkIn, checkOut }: Range,
  req?: Partial<PayloadRequest>,
): Promise<number> {
  const now = new Date().toISOString()

  const { docs } = await payload.find({
    collection: 'bookings',
    req,
    overrideAccess: true,
    depth: 0,
    pagination: false,
    select: { checkIn: true, checkOut: true, rooms: true },
    where: {
      and: [
        { roomType: { equals: roomType.id } },
        { checkIn: { less_than: checkOut.toISOString() } },
        { checkOut: { greater_than: checkIn.toISOString() } },
        {
          or: [
            { status: { equals: 'confirmed' } },
            { and: [{ status: { equals: 'pending' } }, { holdExpiresAt: { greater_than: now } }] },
          ],
        },
      ],
    },
  })

  // Rooms already taken on each night of the requested stay.
  const taken = new Map<string, number>()
  for (const booking of docs) {
    const start = new Date(booking.checkIn)
    const nights = nightsBetween(start, new Date(booking.checkOut))
    for (let i = 0; i < nights; i++) {
      const night = addDays(start, i)
      if (night < checkIn || night >= checkOut) continue
      const key = toDayString(night)
      taken.set(key, (taken.get(key) ?? 0) + (booking.rooms ?? 1))
    }
  }

  const busiestNight = Math.max(0, ...taken.values())
  return Math.max(0, roomType.totalRooms - busiestNight)
}
