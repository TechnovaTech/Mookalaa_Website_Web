"use client"

import { useEffect, useState } from "react"
import { fetchAds, type SponsorAd } from "@/lib/api"

/**
 * Sponsor ad frame, fed by the admin panel's Sponsor Ads screen. Adding an ad
 * there makes it appear here on the next load; removing it, deactivating it,
 * or letting its end date pass takes it away again.
 *
 * Renders nothing at all when there is no live ad, so the page never shows an
 * empty placeholder.
 */
export function SponsorAds() {
  const [ads, setAds] = useState<SponsorAd[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetchAds().then(setAds)
  }, [])

  // Rotate through the ads when there is more than one, matching the app.
  useEffect(() => {
    if (ads.length < 2) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [ads.length])

  if (ads.length === 0) return null

  const ad = ads[Math.min(index, ads.length - 1)]

  const media =
    ad.mediaType === "video" ? (
      <video
        key={ad.id}
        src={ad.image}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    ) : (
      <img
        key={ad.id}
        src={ad.image}
        alt={ad.title || "Sponsored"}
        className="w-full h-full object-cover"
      />
    )

  const frame = (
    <div className="relative h-48 sm:h-60 md:h-72 w-full overflow-hidden rounded-2xl border border-border/40 bg-muted">
      {media}

      {/* Label so sponsored content is never mistaken for editorial */}
      <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
        Sponsored
      </span>

      {(ad.title || ad.sponsor) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
          {ad.title && <p className="font-semibold text-white">{ad.title}</p>}
          {ad.sponsor && <p className="text-sm text-white/75">{ad.sponsor}</p>}
        </div>
      )}
    </div>
  )

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-12 w-full">
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored" className="block">
          {frame}
        </a>
      ) : (
        frame
      )}

      {ads.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {ads.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Show sponsor ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-amber-500" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
