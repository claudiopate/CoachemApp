"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
    id: string
    status: string
    notes: string | null
  }
}

export default function AttendancePage(props: { params: Promise<{ bookingId: string }> }) {
  const params = use(props.params);
  const [booking, setBooking] = useState<Booking | null>(null)
  const [status, setStatus] = useState("present")
  const [notes, setNotes] = useState("")
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
        if (data.attendance) {
          setStatus(data.attendance.status)
          setNotes(data.attendance.notes || "")
        }
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

    setSaving(true)
    try {
      const method = booking?.attendance ? "PATCH" : "POST"
      const endpoint = booking?.attendance 
        ? `/api/attendance/${booking.attendance.id}`
        : "/api/attendance"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: params.bookingId,
          status,
          notes: notes || null
        })
      })

      if (!response.ok) throw new Error("Failed to save attendance")
      
      const updatedAttendance = await response.json()
      setBooking(prev => prev ? {
        ...prev,
        attendance: updatedAttendance
      } : null)
      
      toast.success("Presenza registrata con successo")
      router.push(`/bookings/${params.bookingId}`)
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error("Errore nel salvataggio della presenza")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !booking) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Registra Presenza</h2>
          <p className="text-sm text-muted-foreground">
            Prenotazione del {format(new Date(booking.date), "d MMMM yyyy", { locale: it })}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Indietro
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Dettagli Prenotazione</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Allievo</p>
                <p className="font-medium">{booking.user.userId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Coach</p>
                <p className="font-medium">{booking.coach.userId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Orario</p>
                <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium capitalize">{booking.type}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stato Presenza</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Presente</SelectItem>
                  <SelectItem value="late">In Ritardo</SelectItem>
                  <SelectItem value="absent">Assente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aggiungi note sulla presenza..."
                className="min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvataggio..." : "Salva Presenza"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {booking.attendance && (
        <Card className="p-6 border-muted">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Presenza Attuale</h3>
              <Badge variant={
                booking.attendance.status === "present" ? "default" :
                booking.attendance.status === "late" ? "secondary" :
                "destructive"
              }>
                {booking.attendance.status === "present" ? "Presente" :
                 booking.attendance.status === "late" ? "In Ritardo" :
                 "Assente"}
              </Badge>
            </div>

            {booking.attendance.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Note</h4>
                <p className="text-sm text-muted-foreground">
                  {booking.attendance.notes}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
} 