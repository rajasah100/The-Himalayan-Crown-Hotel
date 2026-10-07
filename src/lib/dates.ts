const DAY_MS = 24 * 60 * 60 * 1000

/** Parses a `YYYY-MM-DD` string to a UTC-midnight Date, or null if invalid. */
export function parseDay(value: string | undefined | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export const toDayString = (date: Date) => date.toISOString().slice(0, 10)

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS)

export const nightsBetween = (checkIn: Date, checkOut: Date) =>
  Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS)

export const todayUTC = () => parseDay(toDayString(new Date()))!

export const formatDay = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
