import clsx from 'clsx'

import type { FormState } from '@/app/(frontend)/actions'

export function FormMessage({ state }: { state: FormState }) {
  if (!state) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={clsx('border-l-2 px-4 py-3 text-sm', state.ok ? 'border-gold bg-gold/10' : 'border-red-700 bg-red-700/5 text-red-800')}
    >
      {state.message}
    </p>
  )
}

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const message = state?.errors?.[name]?.[0]
  return message ? <span className="mt-1 block text-xs text-red-700">{message}</span> : null
}
