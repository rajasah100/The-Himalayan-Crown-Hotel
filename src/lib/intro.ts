/**
 * Tiny client-side signal so page animations (e.g. the hero) can wait for the intro loader
 * to lift before they play. Resolves immediately on repeat visits.
 */
let done = false
const listeners = new Set<() => void>()

export function markIntroDone() {
  if (done) return
  done = true
  listeners.forEach((fn) => fn())
  listeners.clear()
}

export function onIntroDone(fn: () => void): () => void {
  if (done) {
    fn()
    return () => {}
  }
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const INTRO_STORAGE_KEY = 'hc-intro-seen'

/** Inline <head> script: hides the loader before first paint when it was already shown this session. */
export const introSeenScript = `try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))document.documentElement.classList.add('intro-seen')}catch(e){}`
