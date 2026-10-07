'use client'

import { useActionState } from 'react'

import { subscribe } from '@/app/(frontend)/actions'

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null)

  if (state?.ok) return <p className="text-sm text-gold-light">{state.message}</p>

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row" noValidate>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        autoComplete="email"
        className="field flex-1 border-ivory/30 text-ivory placeholder:text-ivory/40"
      />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={pending} className="btn btn-gold shrink-0 disabled:opacity-60">
        {pending ? 'Joining…' : 'Subscribe'}
      </button>
      {state && !state.ok && (
        <p role="alert" className="text-xs text-red-300 sm:basis-full">
          {state.message}
        </p>
      )}
    </form>
  )
}
