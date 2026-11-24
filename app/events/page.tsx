"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { EventFilters } from "@/components/event-filters"
import { fetchApprovedEvents } from "@/lib/api"
import { filterEvents, sortEvents } from "@/lib/utils-events"
import type { FilterOptions, Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Map, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function EventsPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [mapView, setMapView] = useState(false)
  const [sortBy, setSortBy] = useState<"popular" | "date" | "recent">("popular")
  const [displayCount, setDisplayCount] = useState(12)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Live data from the admin panel — the same backend the mobile apps use.
  useEffect(() => {
    async function loadEvents() {
      setLoading(true)
      setAllEvents(await fetchApprovedEvents())
      setLoading(false)
    }
    loadEvents()
  }, [])

  const [filters, setFilters] = useState<FilterOptions>({
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    date: searchParams.get("date") || "",
    priceRange: [0, 1000],
    type: "all",
  })

  const filteredAndSorted = useMemo(() => {
    const excludedCategories = ["Festivals", "Dance", "Workshops", "Custom Orders"]
    const eventsToFilter = allEvents.filter(event => !excludedCategories.includes(event.category))
    const filtered = filterEvents(eventsToFilter, filters)
    const sorted = sortEvents(filtered, sortBy)
    return sorted.slice(0, displayCount)
  }, [filters, sortBy, displayCount, allEvents])

  const handleClearFilters = () => {
    setFilters({
      location: "",
      category: "",
      date: "",
      priceRange: [0, 1000],
      type: "all",
    })
    setSortBy("popular")
    setDisplayCount(12)
  }

  const excludedCategories = ["Festivals", "Dance", "Workshops", "Custom Orders"]
  const totalFilteredEvents = allEvents.filter(event => !excludedCategories.includes(event.category)).filter(event => filterEvents([event], filters).length > 0).length

  return (
    <main className="min-h-screen py-8" suppressHydrationWarning>
      <div className="px-4 sm:px-6 lg:px-8 w-full" suppressHydrationWarning>
        {/* Header */}
        <div className="mb-8 flex items-center gap-4" suppressHydrationWarning>
          <span aria-hidden className="h-10 sm:h-12 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent" suppressHydrationWarning>
            {t("eventsPage.title")}
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between" suppressHydrationWarning>
          <div className="flex gap-2" suppressHydrationWarning>
            <Button
              variant={!mapView ? "default" : "outline"}
              onClick={() => setMapView(false)}
              className="rounded-lg"
              size="sm"
            >
              <LayoutGrid size={16} className="mr-2" />
              {t("eventsPage.gridView")}
            </Button>
            <Button
              variant={mapView ? "default" : "outline"}
              onClick={() => setMapView(true)}
              className="rounded-lg"
              size="sm"
            >
              <Map size={16} className="mr-2" />
              {t("eventsPage.mapView")}
            </Button>
          </div>

          <div className="flex gap-2" suppressHydrationWarning>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition text-sm"
            >
              <option value="popular">{t("eventsPage.sortPopular")}</option>
              <option value="date">{t("eventsPage.sortDate")}</option>
              <option value="recent">{t("eventsPage.sortRecent")}</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8" suppressHydrationWarning>
          {/* Sidebar Filters */}
          <div className="md:col-span-1" suppressHydrationWarning>
            <EventFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={handleClearFilters}
              availableCategories={allEvents.map((event) => event.category)}
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3" suppressHydrationWarning>
            {mapView ? (
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                <p className="text-muted-foreground">Map view coming soon</p>
              </div>
            ) : (
              // Shown in place of the event cards until events go live, as on the home page.
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-card to-amber-600/15 h-64 sm:h-80 flex flex-col items-center justify-center gap-4 text-center px-6">
                <Sparkles size={40} className="text-amber-400" aria-hidden />
                <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Coming Soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
