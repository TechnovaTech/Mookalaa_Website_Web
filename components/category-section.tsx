"use client"

import type { Event } from "@/lib/types"
import { EventCard } from "./event-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface CategorySectionProps {
  category: string
  events: Event[]
}

export function CategorySection({ category, events }: CategorySectionProps) {
  const { t, translateCategory } = useLanguage()
  const categoryEvents = events.filter((e) => e.category === category).slice(0, 6)

  if (categoryEvents.length === 0) return null

  const displayName = translateCategory(category)
  // Display names may already contain the word "events" (e.g. "Art & Culture Events"),
  // so strip it before composing "Discover ... events happening now"
  const subtitleName = displayName.replace(/\bevents?\b/gi, "").replace(/\s+/g, " ").trim().toLowerCase()
  const subtitle = category === "Ollywood"
    ? "New events will be announced soon — stay tuned"
    : `${t("category.discover")} ${subtitleName} ${t("category.eventsNow")}`

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8" suppressHydrationWarning>
        <div suppressHydrationWarning>
          <h2 className="text-3xl font-bold mb-2">{displayName}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Button asChild variant="outline" className="rounded-lg bg-transparent">
          <Link href={`/events?category=${category}`}>
            {t("category.viewAll")} <ChevronRight size={18} />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
        {categoryEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
