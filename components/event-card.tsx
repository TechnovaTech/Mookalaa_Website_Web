"use client"

import type { Event } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Heart } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { formatDate } from "@/lib/utils-events"
import { useLanguage } from "@/lib/language-context"

interface EventCardProps {
  event: Event
  variant?: "grid" | "featured"
}

export function EventCard({ event, variant = "grid" }: EventCardProps) {
  const { t, translateCategory, translateEvent, translateLocation } = useLanguage()
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && videoRef.current && event.hoverVideo) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play()
        } catch (error) {
          // Ignore autoplay errors
        }
      }
      playVideo()
    }
  }, [isMobile, event.hoverVideo])

  const handleMouseEnter = async () => {
    setIsHovered(true)
    if (videoRef.current && event.hoverVideo) {
      try {
        await videoRef.current.play()
      } catch (error) {
        // Ignore play interruption errors
      }
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      } catch (error) {
        // Ignore pause errors
      }
    }
  }

  if (variant === "featured") {
    return (
      <Link href={`/event/${event.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
          <div className="relative overflow-hidden h-64 bg-muted">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {event.featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600">{t("card.featured")}</Badge>
            )}
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <Badge variant="outline" className="rounded-md" suppressHydrationWarning>
                {translateCategory(event.category)}
              </Badge>
              {event.isFree && (
                <Badge variant="secondary" className="rounded-md text-xs">
                  {t("card.free")}
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition" suppressHydrationWarning>{translateEvent(event.id, 'title', event.title)}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="line-clamp-1">{translateLocation(event.city)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{event.attendees.toLocaleString()} {t("card.attending")}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold text-lg">{event.isFree ? t("card.free") : `$${event.price}`}</span>
              {event.rating && <span className="text-sm text-yellow-500">★ {event.rating.toFixed(1)}</span>}
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/event/${event.id}`}>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative overflow-hidden h-40 bg-muted">
          {event.hoverVideo ? (
            <>
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ${(isHovered || isMobile) ? 'opacity-0' : 'opacity-100'}`}
              />
              <video
                ref={videoRef}
                src={event.hoverVideo}
                muted
                loop
                autoPlay={isMobile}
                playsInline
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${(isHovered || isMobile) ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%',
                  transform: 'scale(1.8)'
                }}
              />
            </>
          ) : (
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} color={isLiked ? "#ef4444" : "#666"} />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <Badge variant="outline" className="w-fit rounded-md text-xs mb-2" suppressHydrationWarning>
            {translateCategory(event.category)}
          </Badge>
          <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition flex-1" suppressHydrationWarning>
            {translateEvent(event.id, 'title', event.title)}
          </h3>
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span className="line-clamp-1">{event.isOnline ? t("card.online") : translateLocation(event.city)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-bold text-sm">{event.isFree ? t("card.free") : `$${event.price}`}</span>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              {t("card.view")}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
