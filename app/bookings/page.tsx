"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { toast } from "sonner"

interface Booking {
  id: string
  userId: string
  coachId: string
  date: Date
  startTime: string
  endTime: string
  type: string
  status: string
  user: {
    userId: string
    level: string | null
  }
  coach: {
    userId: string
    level: string | null
  }
  attendance?: {
    status: string
    notes: string | null
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const searchParams = new URLSearchParams()
        if (selectedDate) {
          const from = format(selectedDate, "yyyy-MM-dd")
          const to = format(selectedDate, "yyyy-MM-dd")
          searchParams.set("from", from)
          searchParams.set("to", to)
        }
        if (selectedStatus !== "all") {
          searchParams.set("status", selectedStatus)
        }

        const response = await fetch(`/api/bookings?${searchParams.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast.error("Errore nel caricamento delle prenotazioni")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [selectedDate, selectedStatus])

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error("Failed to update booking")
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ))

      toast.success("Stato della prenotazione aggiornato")
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Errore nell'aggiornamento dello stato")
    }
  }

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete booking")
      
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      toast.success("Prenotazione eliminata con successo")
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast.error("Errore nell'eliminazione della prenotazione")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prenotazioni</h2>
        <Button onClick={() => router.push("/bookings/new")}>
          Nuova Prenotazione
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={it}
                weekStartsOn={1}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stato</label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="upcoming">In programma</SelectItem>
                  <SelectItem value="completed">Completate</SelectItem>
                  <SelectItem value="cancelled">Cancellate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4 pr-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: it })}
                        </p>
                        <Badge variant={
                          booking.status === "completed" ? "secondary" :
                          booking.status === "cancelled" ? "destructive" :
                          "default"
                        }>
                          {booking.status === "upcoming" ? "In programma" :
                           booking.status === "completed" ? "Completata" :
                           "Cancellata"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Coach: {booking.coach.userId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Allievo: {booking.user.userId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">In programma</SelectItem>
                          <SelectItem value="completed">Completata</SelectItem>
                          <SelectItem value="cancelled">Cancellata</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                      >
                        Dettagli
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(booking.id)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  Nessuna prenotazione trovata
                </p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 