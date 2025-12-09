"use client"

import { useState, use } from "react"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronDown } from "lucide-react"
import Link from "next/link"

interface BookingPageProps {
  params: Promise<{ id: string }>
}



const ticketTypes = [
  { id: 1, name: "General", price: 500, available: 50 },
  { id: 2, name: "VIP", price: 1500, available: 20 },
  { id: 3, name: "Premium", price: 2500, available: 10 },
]

export default function BookingPage({ params }: BookingPageProps) {
  const { id } = use(params)
  const event = mockEvents.find((e) => e.id === id)
  
  const [step, setStep] = useState(1)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [tickets, setTickets] = useState<{ [key: number]: number }>({})
  const [expandedVenue, setExpandedVenue] = useState<number | null>(null)

  if (!event) return null

  const venues = [
    { 
      id: 1,
      city: event.location.split(',')[0],
      name: event.location, 
      address: event.location,
      dates: [new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })],
      status: "Fast Filling"
    },
  ]

  const times = [event.time]

  const totalAmount = Object.entries(tickets).reduce((sum, [typeId, count]) => {
    const ticket = ticketTypes.find(t => t.id === Number(typeId))
    return sum + (ticket?.price || 0) * count
  }, 0)

  const totalTickets = Object.values(tickets).reduce((sum, count) => sum + count, 0)

  const handleVenueSelect = (venueName: string, venueId: number) => {
    setSelectedVenue(venueName)
    setExpandedVenue(expandedVenue === venueId ? null : venueId)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const updateTicketCount = (typeId: number, increment: boolean) => {
    setTickets(prev => {
      const current = prev[typeId] || 0
      const newCount = increment ? current + 1 : Math.max(0, current - 1)
      if (newCount === 0) {
        const { [typeId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [typeId]: newCount }
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4 relative max-w-3xl mx-auto">
            <Link href={`/event/${id}`} className="absolute left-0">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Venue</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Date & Time</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className={`font-medium ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Ticket</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                4
              </div>
              <span className={`font-medium ${step >= 4 ? 'text-foreground' : 'text-muted-foreground'}`}>Review & Proceed to Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 1: Select Venue */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Select Venue</h2>
            <div className="space-y-4">
              {venues.map((venue) => (
                <Card key={venue.id} className="overflow-hidden">
                  <button
                    onClick={() => handleVenueSelect(venue.name, venue.id)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{venue.city}</h3>
                      <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${expandedVenue === venue.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {expandedVenue === venue.id && (
                    <button
                      onClick={() => handleDateSelect(venue.dates[0])}
                      className="w-full px-6 pb-6 pt-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <h4 className="text-lg font-semibold mb-2">{venue.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{venue.dates[0]} | <span className="text-orange-500 font-medium">{venue.status}</span></p>
                      <div className="border-t border-border my-3"></div>
                      <p className="text-sm text-muted-foreground mb-2">{venue.address}</p>
                      <span className="text-sm text-red-500 font-medium inline-block cursor-pointer">View on maps</span>
                    </button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 mb-6">
              {/* Status Indicators */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Fast Filling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm">Sold out</span>
                </div>
              </div>

              {/* Select Date */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                <Button
                  variant="outline"
                  className="bg-orange-400 hover:bg-orange-500 text-black border-none h-auto py-4 px-6 text-base"
                >
                  {selectedDate}
                </Button>
              </div>

              {/* Select Time */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Time</h3>
                <Button
                  variant="outline"
                  className="bg-orange-400 hover:bg-orange-500 text-black border-none h-auto py-4 px-6 text-base"
                >
                  {event.time}
                </Button>
              </div>
            </Card>

            {/* Proceed Button */}
            <Button
              onClick={() => setStep(3)}
              className="w-full h-14 text-lg bg-red-500 hover:bg-red-600 text-white"
            >
              Proceed
            </Button>
          </div>
        )}

        {/* Step 3: Select Tickets */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto pb-48">
            <h2 className="text-2xl font-bold mb-2">Select Tickets</h2>
            <p className="text-muted-foreground mb-6">{selectedVenue} - {selectedDate} - {selectedTime}</p>
            <div className="space-y-4">
              {ticketTypes.map((ticket) => (
                <Card key={ticket.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{ticket.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{ticket.price} per ticket</p>
                      <p className="text-xs text-muted-foreground">{ticket.available} available</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTicketCount(ticket.id, false)}
                        disabled={!tickets[ticket.id]}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{tickets[ticket.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTicketCount(ticket.id, true)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalTickets > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-2xl font-bold">₹{totalAmount}</p>
                    <p className="text-sm text-muted-foreground">{totalTickets} Ticket</p>
                  </div>
                  <Button
                    onClick={() => setStep(4)}
                    className="bg-red-500 hover:bg-red-600 text-white px-12 h-12"
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Proceed */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Left Side - Ticket Options */}
            <div>
              <p className="text-muted-foreground mb-4">Please select from the following option(s)</p>
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <input type="radio" checked readOnly className="mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">M-Ticket</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>🌍</span>
                      <span>Save the planet. Use your phone as a ticket.</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-white">
                  <h4 className="font-semibold mb-3 text-white">M-Ticket Information</h4>
                  <ol className="space-y-2 text-sm text-white">
                    <li>1. Customer(s) can access their ticket(s) from the 'My Profile' section on the app/mobile-web.</li>
                    <li>2. It is mandatory to present the ticket(s) in my profile section via app/mobile-web at the venue.</li>
                    <li>3. No physical ticket(s) are required to enter the venue.</li>
                  </ol>
                </div>
              </Card>
            </div>

            {/* Right Side - Booking Summary */}
            <div>
              <Card className="p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="font-bold text-lg">₹{totalAmount}.00</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{totalTickets} Ticket</p>
                
                <div className="border-t pt-4 space-y-2 text-sm">
                  <p className="font-medium">Sun, {selectedDate}, 2025</p>
                  <p>04:00 PM</p>
                  <p className="font-semibold mt-3">Venue</p>
                  <p>{selectedVenue}</p>
                  <p className="mt-3">
                    {Object.entries(tickets).map(([typeId, count]) => {
                      const ticket = ticketTypes.find(t => t.id === Number(typeId))
                      return ticket ? `${ticket.name.toUpperCase()}(${ticket.price}): ${count} ticket(s)` : ''
                    })}
                  </p>
                </div>
              </Card>

              <Card className="p-6 mb-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Sub-total</span>
                    <span>₹{totalAmount}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Fee</span>
                    <span>₹{Math.round(totalAmount * 0.095)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total Amount</span>
                    <span>₹{totalAmount + Math.round(totalAmount * 0.095)}</span>
                  </div>
                </div>
              </Card>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Select State</label>
                <select className="w-full p-3 border rounded-lg bg-background">
                  <option>Gujarat</option>
                  <option>Maharashtra</option>
                  <option>Rajasthan</option>
                </select>
              </div>

              <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
                <span className="text-blue-500">ⓘ</span>
                <p>By proceeding, I express my consent to complete this transaction.</p>
              </div>

              <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white h-12">
                <Link href={`/event/${id}/book/payment?amount=${totalAmount}&tickets=${totalTickets}`}>Proceed to Pay</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
