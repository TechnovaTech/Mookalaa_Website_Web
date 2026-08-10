import type { Event, EventCity } from "@/lib/types"

/**
 * Artwork for the cities we have photography for. This is presentation only —
 * the city list and its counts are derived from real approved events, never
 * from a hardcoded table.
 */
const CITY_IMAGES: Record<string, string> = {
  odisha: "/image.png",
  bhubaneswar: "/lingaraj-temple-bhubaneshwar-odisha-2-attr-hero.jpg",
  delhi: "/delhi-india-cultural-hub.jpg",
  mumbai: "/mumbai-india-arts-scene.jpg",
  bangalore: "/bangalore-india-tech-arts-fusion.jpg",
  bengaluru: "/bangalore-india-tech-arts-fusion.jpg",
  kolkata: "/kolkata-india-cultural-capital.jpg",
}

/**
 * Group approved events by city so the home page shows where events are
 * actually happening, with counts that match reality.
 */
export function buildTrendingCities(events: Event[], limit = 6): EventCity[] {
  const byCity = new Map<string, { name: string; count: number }>()

  for (const event of events) {
    const name = (event.city || "").trim()
    if (!name || name.toLowerCase() === "city tba") continue

    const key = name.toLowerCase()
    const entry = byCity.get(key)
    if (entry) {
      entry.count += 1
    } else {
      byCity.set(key, { name, count: 1 })
    }
  }

  return Array.from(byCity.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([key, { name, count }]) => ({
      name,
      country: "India",
      eventCount: count,
      image: CITY_IMAGES[key] || "/placeholder.jpg",
      coordinates: { lat: 0, lng: 0 },
    }))
}
