'use client'

import { useActionState } from 'react'

import { submitEnquiry } from '@/app/(frontend)/actions'

import { FieldError, FormMessage } from './FormMessage'

const TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'event', label: 'Meeting / Event' },
  { value: 'dining', label: 'Dining reservation' },
  { value: 'spa', label: 'Spa' },
  { value: 'general', label: 'General enquiry' },
]

export function EnquiryForm({ defaultType = 'wedding', defaultMessage = '' }: { defaultType?: string; defaultMessage?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, null)

  if (state?.ok) {
    return (
      <div className="py-16 text-center">
        <p className="display text-4xl">Thank you</p>
        <p className="mt-4 text-stone">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-8 sm:grid-cols-2" noValidate>
      <label className="block sm:col-span-2">
        <span className="field-label">I&apos;m enquiring about</span>
        <select name="type" defaultValue={defaultType} className="field">
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="field-label">Full name *</span>
        <input name="name" className="field" autoComplete="name" required />
        <FieldError state={state} name="name" />
      </label>
      <label className="block">
        <span className="field-label">Email *</span>
        <input name="email" type="email" className="field" autoComplete="email" required />
        <FieldError state={state} name="email" />
      </label>
      <label className="block">
        <span className="field-label">Phone</span>
        <input name="phone" type="tel" className="field" autoComplete="tel" />
      </label>
      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="field-label">Date</span>
          <input name="preferredDate" type="date" className="field" />
        </label>
        <label className="block">
          <span className="field-label">Guests</span>
          <input name="guests" type="number" min={1} className="field" />
        </label>
      </div>
      <label className="block sm:col-span-2">
        <span className="field-label">Tell us more *</span>
        <textarea name="message" rows={4} className="field resize-none" defaultValue={defaultMessage} required />
        <FieldError state={state} name="message" />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="space-y-4 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>
    </form>
  )
}
