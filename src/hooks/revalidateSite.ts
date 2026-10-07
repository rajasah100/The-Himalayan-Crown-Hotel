import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Content is shared across pages (header, footer, home, listings), so any edit refreshes the whole site.
const revalidateAll = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (e.g. `pnpm seed`) there is no cache to revalidate.
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateAll()
  return doc
}

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAll()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateAll()
  return doc
}

export const revalidateHooks = { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] }
