"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookingForm } from "./booking-form"

interface Booking {
  id: string
  date: Date
  startTime: string
  endTime: string
  type: string
  status: string
  userId: string
  user?: {
    name: string
    email: string
  }
}

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Errore",
        description: "Impossibile caricare le prenotazioni",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking)
  }

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete booking")
      }

      toast({
        title: "Prenotazione eliminata",
        description: "La prenotazione è stata eliminata con successo",
      })

      fetchBookings()
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast({
        title: "Errore",
        description: "Impossibile eliminare la prenotazione",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (formData: any) => {
    if (!editingBooking) return

    try {
      const response = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update booking")
      }

      toast({
        title: "Prenotazione aggiornata",
        description: "La prenotazione è stata aggiornata con successo",
      })

      setEditingBooking(null)
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking:", error)
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la prenotazione",
        variant: "destructive",
      })
    }
  }

  const selectedDateBookings = bookings.filter(
    (booking) => new Date(booking.date).toDateString() === date?.toDateString()
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendario</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prenotazioni del giorno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDateBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessuna prenotazione per questa data
              </p>
            ) : (
              selectedDateBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {booking.user?.name || "Cliente non specificato"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.type}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(booking)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica prenotazione</DialogTitle>
            <DialogDescription>
              Modifica i dettagli della prenotazione
            </DialogDescription>
          </DialogHeader>
          {editingBooking && (
            <BookingForm
              initialData={editingBooking}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}