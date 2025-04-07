"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { toast } from "sonner"

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
]

interface Profile {
  userId: string
  level: string | null
}

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

export default function BookingPage(props: { params: Promise<{ bookingId: string }> }) {
  const params = use(props.params);
  const [booking, setBooking] = useState<Booking | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`)
        if (!response.ok) throw new Error("Failed to fetch booking")
        const data = await response.json()
        
        setBooking(data)
        setDate(new Date(data.date))
        setStartTime(data.startTime)
        setEndTime(data.endTime)
        setType(data.type)
        setStatus(data.status)
      } catch (error) {
        console.error("Error fetching booking:", error)
        toast.error("Errore nel caricamento della prenotazione")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.bookingId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime) {
      toast.error("Compila tutti i campi obbligatori")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/bookings/${params.bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(date, "yyyy-MM-dd"),
          startTime,
          endTime,
          type,
          status
        })
      })

      if (!response.ok) throw new Error("Failed to update booking")
      
      const updatedBooking = await response.json()
      setBooking(updatedBooking)
      toast.success("Prenotazione aggiornata con successo")
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Errore nell'aggiornamento della prenotazione")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return

    try {
      const response = await fetch(`/api/bookings/${params.bookingId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete booking")
      
      toast.success("Prenotazione eliminata con successo")
      router.push("/bookings")
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast.error("Errore nell'eliminazione della prenotazione")
    }
  }

  if (loading || !booking) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Dettagli Prenotazione</h2>
          <p className="text-sm text-muted-foreground">
            Creata il {format(new Date(booking.date), "d MMMM yyyy", { locale: it })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Indietro
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Elimina
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Dettagli</TabsTrigger>
          <TabsTrigger value="attendance">Presenze</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Data</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={it}
                  weekStartsOn={1}
                  className="rounded-md border mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ora inizio</label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ora fine</label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots
                        .filter((time) => time > startTime)
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Lezione</SelectItem>
                    <SelectItem value="evaluation">Valutazione</SelectItem>
                    <SelectItem value="recovery">Recupero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stato</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">In programma</SelectItem>
                    <SelectItem value="completed">Completata</SelectItem>
                    <SelectItem value="cancelled">Cancellata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Allievo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.user.userId}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Coach</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.coach.userId}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="p-6">
            {booking.attendance ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Stato Presenza</h3>
                  <Badge variant={
                    booking.attendance.status === "present" ? "default" :
                    booking.attendance.status === "late" ? "secondary" :
                    "destructive"
                  }>
                    {booking.attendance.status === "present" ? "Presente" :
                     booking.attendance.status === "late" ? "In ritardo" :
                     "Assente"}
                  </Badge>
                </div>

                {booking.attendance.notes && (
                  <div>
                    <h3 className="font-medium">Note</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.attendance.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nessuna presenza registrata
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 