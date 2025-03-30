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
  userId: string
  user?: {
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

  if (!date) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Seleziona una data per vedere le prenotazioni</p>
      </div>
    )
  }

  const selectedDateBookings = bookings.filter(
    (booking) => new Date(booking.date).toDateString() === date.toDateString()
  )

  return (
    <div className="space-y-4">
      {selectedDateBookings.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Nessuna prenotazione per questa data</p>
        </div>
      ) : (
        selectedDateBookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {booking.startTime} - {booking.endTime}
                </div>
                <div className="mt-2 text-sm">
                  <div className="text-muted-foreground">Cliente:</div>
                  <div>{booking.user?.name || "Cliente non specificato"}</div>
                  <div className="text-muted-foreground mt-1">Tipo:</div>
                  <div>{booking.type}</div>
                  <div className="text-muted-foreground mt-1">Stato:</div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(booking)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(booking.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

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
