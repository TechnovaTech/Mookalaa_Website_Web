"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-[#124972]/40" style={{backgroundColor: '#124972'}}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition flex-shrink-0">
            <img src="/mookalaa-logo-2.png" alt="MOOKALAA - Unite through Arts" className="h-8 sm:h-10 w-auto" />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search arts & events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/20 transition text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-muted-foreground" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/20 transition text-xs sm:text-sm appearance-none pr-7 sm:pr-8 cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">हिं</option>
              </select>
              <Globe size={14} className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            
            {/* Explore Button */}
            <Button asChild size="sm" className="rounded-lg bg-accent hover:bg-accent/90 text-xs sm:text-sm px-3 sm:px-4">
              <Link href="/events">{t("explore")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
