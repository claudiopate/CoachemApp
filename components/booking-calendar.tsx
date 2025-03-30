"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  userId: string
  coachId: string
  organizationId: string
  date: Date
  startTime: string
  endTime: string
  type: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export function BookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings")
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-2">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-accent",
              booking.status === "completed" && "opacity-50"
            )}
          >
            <div className="font-medium">
              {new Date(booking.date).toLocaleDateString("it-IT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              {booking.startTime} - {booking.endTime}
            </div>
            <div className="text-sm text-muted-foreground">
              Tipo: {booking.type}
            </div>
            <div className="text-sm text-muted-foreground">
              Stato: {booking.status}
            </div>
          </Card>
        ))}
        {bookings.length === 0 && (
          <div className="text-center text-muted-foreground">
            Nessuna prenotazione trovata
          </div>
        )}
      </div>
    </ScrollArea>
  )
} 