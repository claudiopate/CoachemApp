"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
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
  profile: {
    id: string
    name: string
    email: string
  }
}

type ScheduleViewProps = {
  date?: Date
}

export function ScheduleView({ date }: ScheduleViewProps) {
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
      console.log("Bookings data:", data) // Debug log
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

  const filteredBookings = date
    ? bookings.filter(
        (booking) =>
          new Date(booking.date).toDateString() === date.toDateString()
      )
    : bookings

  return (
    <div className="space-y-4">
      {filteredBookings.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nessuna prenotazione {date ? "per questa data" : ""}
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
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
                <div className="space-y-1">
                  <div className="text-sm font-medium">Cliente:</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.profile?.name || "Cliente non specificato"}
                  </div>
                  <div className="text-sm font-medium">Tipo:</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.type}
                  </div>
                  <Badge
                    variant={
                      booking.status === "completed"
                        ? "default"
                        : booking.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {booking.status === "pending"
                      ? "In attesa"
                      : booking.status === "completed"
                      ? "Completata"
                      : "Cancellata"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(booking)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(booking.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Prenotazione</DialogTitle>
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
