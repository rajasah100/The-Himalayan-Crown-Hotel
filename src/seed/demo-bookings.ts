/**
 * Adds demo bookings over the next three weeks so the admin dashboard has something to show.
 * Additive only — re-running replaces previous demo bookings (guest emails demo-*@example.com).
 *
 *   pnpm seed:bookings
 */
import config from '@payload-config'
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const DAY = 86_400_000

const today = new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu' }).format(new Date())}T00:00:00.000Z`)

await payload.delete({ collection: 'bookings', where: { guestEmail: { like: 'demo-' } }, overrideAccess: true })

const { docs: roomTypes } = await payload.find({ collection: 'room-types', depth: 0, pagination: false, sort: 'order' })
if (roomTypes.length === 0) {
  payload.logger.error('No room types — run `pnpm seed` first.')
  process.exit(1)
}

// Deterministic pseudo-random so the dashboard looks the same on every run.
let seed = 7
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

const countries = ['United Kingdom', 'India', 'United States', 'China', 'Australia', 'Germany', 'Nepal', 'Japan']
let created = 0

for (let i = 0; i < 70; i++) {
  // Weighted toward cheaper rooms, which have far more inventory.
  const r = rand()
  const roomType = r < 0.55 ? roomTypes[0] : r < 0.85 ? roomTypes[1] : r < 0.97 ? roomTypes[2] : roomTypes[3]
  const startOffset = Math.floor(rand() * 21) - 2 // a couple already in-house
  const nights = 1 + Math.floor(rand() * 4)
  const checkIn = new Date(today.getTime() + startOffset * DAY)
  const checkOut = new Date(checkIn.getTime() + nights * DAY)
  const rooms = rand() < 0.15 ? 2 : 1
  const status = rand() < 0.88 ? 'confirmed' : 'pending'

  await payload.create({
    collection: 'bookings',
    overrideAccess: true,
    data: {
      reference: `HC-${randomBytes(4).toString('hex').toUpperCase()}`,
      status,
      paymentStatus: status === 'confirmed' ? 'paid' : 'unpaid',
      paymentMethod: status === 'confirmed' ? (['esewa', 'khalti', 'card', 'card'] as const)[i % 4] : undefined,
      roomType: roomType.id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      rooms,
      adults: 2,
      children: 0,
      guestName: `Demo Guest ${i + 1}`,
      guestEmail: `demo-${i + 1}@example.com`,
      guestCountry: countries[i % countries.length],
      totalAmount: roomType.baseRateUSD * nights * rooms,
      currency: 'USD',
      holdExpiresAt: status === 'pending' ? new Date(Date.now() + 12 * 60_000).toISOString() : undefined,
    },
  })
  created++
}

payload.logger.info(`Created ${created} demo bookings.`)
process.exit(0)
