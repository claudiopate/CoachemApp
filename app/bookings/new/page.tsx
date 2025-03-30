"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function NewBookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [coachId, setCoachId] = useState<string>("")
  const [type, setType] = useState<string>("lesson")
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [coaches, setCoaches] = useState<Profile[]>([])
  const router = useRouter()

  // Carica i profili e i coach
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/profiles")
        if (!response.ok) throw new Error("Failed to fetch profiles")
        const data = await response.json()
        
        // Filtra i coach (assumendo che abbiano un livello "coach")
        const coachProfiles = data.filter((p: Profile) => p.level === "coach")
        const studentProfiles = data.filter((p: Profile) => p.level !== "coach")
        
        setCoaches(coachProfiles)
        setProfiles(studentProfiles)
      } catch (error) {
        console.error("Error fetching profiles:", error)
        toast.error("Errore nel caricamento dei profili")
      }
    }

    fetchProfiles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime || !userId || !coachId) {
      toast.error("Compila tutti i campi obbligatori")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(date, "yyyy-MM-dd"),
          startTime,
          endTime,
          userId,
          coachId,
          type
        })
      })

      if (!response.ok) throw new Error("Failed to create booking")
      
      toast.success("Prenotazione creata con successo")
      router.push("/bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Errore nella creazione della prenotazione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nuova Prenotazione</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Annulla
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
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
                    <SelectValue placeholder="Seleziona orario" />
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
                    <SelectValue placeholder="Seleziona orario" />
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
              <label className="text-sm font-medium">Allievo</label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona allievo" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.userId} value={profile.userId}>
                      {profile.userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Coach</label>
              <Select value={coachId} onValueChange={setCoachId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona coach" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.userId} value={coach.userId}>
                      {coach.userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Prenotazione"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
} 