import 'server-only'

export type Weather = { temperature: number; label: string }

// WMO weather interpretation codes → short English labels.
const LABELS: [number[], string][] = [
  [[0], 'Clear skies'],
  [[1, 2], 'Partly cloudy'],
  [[3], 'Overcast'],
  [[45, 48], 'Misty'],
  [[51, 53, 55, 56, 57], 'Drizzle'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'Rain'],
  [[71, 73, 75, 77, 85, 86], 'Snow'],
  [[95, 96, 99], 'Thunderstorms'],
]

/** Current conditions from Open-Meteo (free, no key). Cached for 30 minutes; null if unavailable. */
export async function getCurrentWeather(lat = 27.7172, lon = 85.324): Promise<Weather | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia%2FKathmandu`
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const data = (await res.json()) as { current?: { temperature_2m?: number; weather_code?: number } }
    const t = data.current?.temperature_2m
    const code = data.current?.weather_code
    if (typeof t !== 'number' || typeof code !== 'number') return null
    const label = LABELS.find(([codes]) => codes.includes(code))?.[1] ?? 'Fair'
    return { temperature: Math.round(t), label }
  } catch {
    return null
  }
}
