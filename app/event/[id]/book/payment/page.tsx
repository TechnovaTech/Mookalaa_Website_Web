"use client"

import { use } from "react"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, CreditCard, Wallet, Building2, Smartphone } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const event = mockEvents.find((e) => e.id === id)

  if (!event) return null

  const subtotal = Number(searchParams.get('amount')) || 0
  const tickets = Number(searchParams.get('tickets')) || 0
  const bookingFee = Math.round(subtotal * 0.095)
  const totalAmount = subtotal + bookingFee

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4 relative max-w-3xl mx-auto">
            <Link href={`/event/${id}/book`} className="absolute left-0">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Payment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Payment Methods */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
            
            <div className="space-y-4">
              {/* UPI */}
              <Card className="p-6 hover:border-primary cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">UPI</h3>
                    <p className="text-sm text-muted-foreground">Pay using UPI apps</p>
                  </div>
                </div>
              </Card>

              {/* Credit/Debit Card */}
              <Card className="p-6 hover:border-primary cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Credit/Debit Card</h3>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
              </Card>

              {/* Net Banking */}
              <Card className="p-6 hover:border-primary cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Net Banking</h3>
                    <p className="text-sm text-muted-foreground">All major banks supported</p>
                  </div>
                </div>
              </Card>

              {/* Wallets */}
              <Card className="p-6 hover:border-primary cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <Wallet className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Wallets</h3>
                    <p className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
            
            <Card className="p-6 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="font-bold text-lg">₹{subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tickets} Ticket{tickets > 1 ? 's' : ''}</p>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">Sun, 28 Dec, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">04:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span className="font-medium">Pramukh Swami Auditorium: Rajkot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets:</span>
                  <span className="font-medium">{tickets} ticket(s)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Sub-total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee</span>
                  <span>₹{bookingFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-4 border-white">
              <div className="flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <div className="text-sm">
                  <p className="font-semibold mb-2 text-white">Important Information:</p>
                  <ul className="space-y-1 text-white">
                    <li>• Your booking will be confirmed instantly</li>
                    <li>• M-Ticket will be sent to your registered email</li>
                    <li>• Please carry a valid ID proof to the venue</li>
                    <li>• Entry is subject to venue guidelines</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg"
            >
              Pay ₹{totalAmount.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
