"use client"

import { HeroSearch } from "@/components/hero-search"
import { Sparkles } from "lucide-react"
import { CategorySection } from "@/components/category-section"
import { TrendingCities } from "@/components/trending-cities"
import { Newsletter } from "@/components/newsletter"
import { SponsorAds } from "@/components/sponsor-ads"
import { useLanguage } from "@/lib/language-context"
import { fetchApprovedEvents, fetchCategories } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Event, EventCity } from "@/lib/types"

export default function Home() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Live data from the admin panel — the same backend the mobile apps use.
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [eventsData, categoriesData] = await Promise.all([
        fetchApprovedEvents(),
        fetchCategories(),
      ])
      setEvents(eventsData)
      // Only show categories that actually have an approved event behind them.
      // De-duplicate first: the admin panel allows two categories with the same
      // name, which would otherwise collide as React keys.
      const withEvents = Array.from(new Set<string>(categoriesData)).filter((category) =>
        eventsData.some((event: Event) => event.category === category),
      )
      setCategories(withEvents)
      setLoading(false)
    }
    loadData()
  }, [])

  const translatedEvents = events
  // While events are coming soon, Trending Cities shows Bhubaneswar, Odisha.
  const trendingCities: EventCity[] = [
    {
      name: "Bhubaneswar",
      country: "India",
      eventCount: 0,
      image: "/lingaraj-temple-bhubaneshwar-odisha-2-attr-hero.jpg",
      coordinates: { lat: 20.2961, lng: 85.8245 },
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
        <HeroSearch />
      </section>

      {/* MOOKALAA Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { label: t("stats.eventsBooked"), value: "150+" },
            { label: t("stats.artists"), value: "250+" },
            { label: t("stats.tickets"), value: "50,000+" },
            { label: t("stats.learners"), value: "2,000+" },
            { label: t("stats.orders"), value: "3,000+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-amber-500">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events: a Coming Soon card until featured events go live */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8 flex items-center gap-4">
          <span aria-hidden className="h-10 sm:h-12 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            {t("featured.title")}
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-card to-amber-600/15 h-64 sm:h-80 flex flex-col items-center justify-center gap-4 text-center px-6">
          <Sparkles size={40} className="text-amber-400" aria-hidden />
          <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Coming Soon
          </p>
        </div>
      </section>

      {/* Sponsor Ads — managed from the admin panel, hides itself when empty */}
      <SponsorAds />

      {/* Indian Idol Contestants Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <CategorySection category="Indian idol contestants" events={translatedEvents} />
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 w-full space-y-4">
        {categories.map((category) => (
          <CategorySection key={category} category={category} events={translatedEvents} />
        ))}

      </section>

      {loading && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
          <p className="text-center text-muted-foreground">Loading events...</p>
        </section>
      )}

      {!loading && events.length === 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
          <p className="text-center text-muted-foreground">
            No events available right now. Please check back soon.
          </p>
        </section>
      )}

      {/* Trending Cities */}
      {trendingCities.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <TrendingCities cities={trendingCities} />
        </section>
      )}

      {/* Newsletter */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Newsletter />
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">{t("footer.discover")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/about" className="hover:text-foreground transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-foreground transition">
                    {t("footer.browse")}
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-foreground transition">
                    {t("footer.trending")}
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-foreground transition">
                    {t("footer.category")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t("footer.artists")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("footer.register")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("footer.monetize")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("footer.resources")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:info@mookalaa.com" className="hover:text-foreground transition">
                    info@mookalaa.com
                  </a>
                </li>
                <li>
                  <a href="mailto:support@mookalaa.com" className="hover:text-foreground transition">
                    support@mookalaa.com
                  </a>
                </li>
                <li>
                  <a href="mailto:sponsors@mookalaa.com" className="hover:text-foreground transition">
                    sponsors@mookalaa.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/privacy" className="hover:text-foreground transition">
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-foreground transition">
                    {t("footer.terms")}
                  </a>
                </li>
                <li>
                  <a href="/refund-policy" className="hover:text-foreground transition">
                    {t("footer.refund")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="tel:9583023002" className="hover:text-foreground transition">
                    +91 9583023002
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">VENOOTIC ENTERPRISES OPC PVT LTD</p>
            <p>CIN: U90001OD2025OPC051514 &nbsp;|&nbsp; GST: 21AALCV6186G1Z3</p>
            <p>Registered Office: Satya Vihar, Rasulghar, Bhubaneswar, Khorda, Odisha, 751010</p>
            <p className="pt-2">&copy; {new Date().getFullYear()} Venootic Enterprises OPC Private Limited. MOOKALAA is a registered trademark.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
