"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { it } from "date-fns/locale"

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

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
const MONTHS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
]

export function BookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

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

  const selectedDayBookings = bookings.filter(
    (booking) =>
      selectedDate &&
      new Date(booking.date).toDateString() === selectedDate.toDateString()
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={it}
            weekStartsOn={1}
            className="mx-auto"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-6",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-base font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-2",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.875rem] px-0",
              row: "flex w-full mt-2",
              cell: "h-10 w-10 text-center text-sm relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              ),
              day_range_end: "day-range-end",
              day_range_start: "day-range-start",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              day_today: "bg-accent text-accent-foreground rounded-md",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate?.toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {selectedDayBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-accent/5 transition-colors rounded-lg border shadow-sm",
                    booking.status === "completed" && "opacity-50"
                  )}
                >
                  <div className="text-base font-medium">
                    {booking.startTime} - {booking.endTime}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Tipo: {booking.type}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Stato: {booking.status}
                  </div>
                </Card>
              ))}
              {selectedDayBookings.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  Nessuna prenotazione per questa data
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
} 