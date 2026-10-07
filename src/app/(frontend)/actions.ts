'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { BookingError, createBookingHold } from '@/lib/booking'
import { parseDay, todayUTC } from '@/lib/dates'
import { getPayloadClient } from '@/lib/payload'

export type FormState = { ok: boolean; message: string; errors?: Record<string, string[]> } | null

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined)

const enquirySchema = z.object({
  type: z.enum(['general', 'wedding', 'event', 'dining', 'spa']),
  name: z.string().trim().min(2, 'Please tell us your name').max(120),
  email: z.email('Please enter a valid email'),
  phone: optionalText(40),
  preferredDate: optionalText(10),
  guests: z.coerce.number().int().min(1).max(2000).optional().catch(undefined),
  message: z.string().trim().min(10, 'A few more words, please').max(4000),
  // Honeypot: real people never fill this hidden field.
  company: z.string().max(0).optional(),
})

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = enquirySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Please check the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { company: _honeypot, preferredDate, ...data } = parsed.data
  const date = parseDay(preferredDate)

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'enquiries',
    overrideAccess: true,
    data: { ...data, preferredDate: date?.toISOString(), status: 'new' },
  })

  return { ok: true, message: 'Thank you. Our team will be in touch within 24 hours.' }
}

const holdSchema = z
  .object({
    roomTypeId: z.coerce.number().int().positive(),
    checkIn: z.string(),
    checkOut: z.string(),
    rooms: z.coerce.number().int().min(1).max(4),
    adults: z.coerce.number().int().min(1).max(12),
    children: z.coerce.number().int().min(0).max(8).default(0),
    guestName: z.string().trim().min(2, 'Please enter the guest name').max(120),
    guestEmail: z.email('Please enter a valid email'),
    guestPhone: optionalText(40),
    guestCountry: optionalText(60),
    specialRequests: optionalText(2000),
  })
  .transform((v, ctx) => {
    const checkIn = parseDay(v.checkIn)
    const checkOut = parseDay(v.checkOut)
    if (!checkIn || !checkOut || checkIn < todayUTC()) {
      ctx.addIssue({ code: 'custom', message: 'Please choose valid dates', path: ['checkIn'] })
      return z.NEVER
    }
    return { ...v, checkIn, checkOut }
  })

export async function holdBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = holdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Please check the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors }
  }

  let reference: string
  try {
    const payload = await getPayloadClient()
    const booking = await createBookingHold(payload, parsed.data)
    reference = booking.reference
  } catch (error) {
    if (error instanceof BookingError) return { ok: false, message: error.message }
    throw error
  }

  redirect(`/book/confirmation?ref=${reference}`)
}

const subscribeSchema = z.object({
  email: z.email('Please enter a valid email'),
  company: z.string().max(0).optional(),
})

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, message: 'Please enter a valid email address.' }

  const payload = await getPayloadClient()
  const email = parsed.data.email.toLowerCase()
  const existing = await payload.count({ collection: 'subscribers', where: { email: { equals: email } }, overrideAccess: true })
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'subscribers', data: { email }, overrideAccess: true })
  }
  return { ok: true, message: 'Thank you — you’ll hear from us with seasonal offers and stories.' }
}
