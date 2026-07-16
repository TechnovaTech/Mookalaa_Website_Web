"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, X, Download, Smartphone } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

// APK download links — replace "#" with the real APK file URLs when ready
const MOOKALAA_APP_APK_URL = "#"
const MOOKALAA_ARTIST_APP_APK_URL = "#"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const addScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)
      }
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'bn,brx,doi,gu,hi,kn,ks,gom,mai,ml,mni,mr,ne,or,pa,sa,sat,sd,ta,te,ur',
          layout: window.google.translate.TranslateElement.InlineLayout.DROPDOWN,
          multilanguagePage: true,
          autoDisplay: false
        },
        'google_translate_element'
      )
      
      setTimeout(() => {
        const banner = document.querySelector('.goog-te-banner-frame')
        if (banner) banner.remove()
        
        // Clear any saved language to always start fresh
        localStorage.removeItem('googtrans')
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        
        const combo = document.querySelector('.goog-te-combo')
        if (combo) {
          // Add default "Select Language" option
          const selectElement = combo as HTMLSelectElement
          if (selectElement && !selectElement.querySelector('option[value=""]')) {
            const defaultOption = document.createElement('option')
            defaultOption.value = ''
            defaultOption.text = 'Select Language'
            defaultOption.selected = true
            selectElement.insertBefore(defaultOption, selectElement.firstChild)
          }
          
          combo.addEventListener('change', function() {
            const selectedValue = (this as HTMLSelectElement).value
            if (selectedValue === '') {
              // Reset to English if "Select Language" is chosen
              window.location.reload()
            } else {
              setTimeout(() => {
                const banner = document.querySelector('.goog-te-banner-frame')
                if (banner) banner.remove()
              }, 100)
            }
          })
        }
      }, 1000)
    }

    addScript()
    
    // Always clear translation data on page load
    localStorage.removeItem('googtrans')
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    const observer = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame')
      if (banner) banner.remove()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => observer.disconnect()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200 bg-white">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          {/* Left: Logo + Search */}
          <div className="flex items-center flex-1 min-w-0 gap-4 lg:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition flex-shrink-0">
              <img src="/mookalaa-logo-2.png" alt="MOOKALAA - Unite through Arts" className="h-12 sm:h-16 w-auto" />
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search arts & events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/30 transition text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={18} className="text-gray-500" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0" suppressHydrationWarning>
            {/* Google Translate */}
            <div className="hidden lg:flex items-center" suppressHydrationWarning>
              <div id="google_translate_element" suppressHydrationWarning></div>
            </div>

            {/* Art & Culture Button */}
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex rounded-lg border-[#124972]/40 bg-transparent text-[#124972] hover:bg-[#124972]/5 hover:text-[#124972] text-xs sm:text-sm px-4 sm:px-5"
            >
              Art & Culture
            </Button>

            {/* Explore Button */}
            <Button asChild size="sm" className="rounded-lg bg-accent hover:bg-accent/90 text-xs sm:text-sm px-4 sm:px-5">
              <Link href="/events">{t("explore")}</Link>
            </Button>

            {/* Download App Button */}
            <Button
              size="sm"
              onClick={() => setIsDownloadOpen(true)}
              className="rounded-lg bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white text-xs sm:text-sm px-4 sm:px-5"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">App</span>
            </Button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
          line-height: 0 !important;
          color: transparent !important;
        }
        .goog-te-gadget > span,
        .goog-te-gadget a,
        .goog-te-gadget .goog-logo-link {
          display: none !important;
        }
        #google_translate_element {
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          font-size: 14px !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
          color: white !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-combo {
          padding: 12px 12px 8px 12px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          background: white !important;
          color: #124972 !important;
          font-size: 14px !important;
          min-width: 150px !important;
        }
        .goog-te-gadget-simple a {
          display: none !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        body > .skiptranslate {
          display: none !important;
        }
      `}</style>
    </header>

    {/* Download App Popup */}
    <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download Mookalaa App</DialogTitle>
          <DialogDescription>
            Get the Mookalaa apps on your Android device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4 flex flex-col items-center text-center gap-3">
            <Smartphone className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">Mookalaa App</p>
              <p className="text-xs text-muted-foreground">Discover & book arts and cultural events</p>
            </div>
            <Button asChild size="sm" className="w-full rounded-lg bg-accent hover:bg-accent/90 mt-auto">
              <a href={MOOKALAA_APP_APK_URL} onClick={(e) => MOOKALAA_APP_APK_URL === "#" && e.preventDefault()}>
                <Download className="h-4 w-4" />
                Download APK
              </a>
            </Button>
          </div>
          <div className="rounded-lg border border-border p-4 flex flex-col items-center text-center gap-3">
            <Smartphone className="h-8 w-8 text-accent" />
            <div>
              <p className="font-semibold">Mookalaa Artist App</p>
              <p className="text-xs text-muted-foreground">For artists — manage your profile & bookings</p>
            </div>
            <Button asChild size="sm" className="w-full rounded-lg bg-accent hover:bg-accent/90 mt-auto">
              <a href={MOOKALAA_ARTIST_APP_APK_URL} onClick={(e) => MOOKALAA_ARTIST_APP_APK_URL === "#" && e.preventDefault()}>
                <Download className="h-4 w-4" />
                Download APK
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
