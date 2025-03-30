"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { toast } from "sonner"

interface Progress {
  id: string
  profileId: string
  date: Date
  notes: string | null
}

interface Profile {
  userId: string
  level: string | null
}

export default function ProgressPage({ params }: { params: { profileId: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [progressRecords, setProgressRecords] = useState<Progress[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica il profilo
        const profileResponse = await fetch(`/api/profiles/${params.profileId}`)
        if (!profileResponse.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileResponse.json()
        setProfile(profileData)

        // Carica i progressi
        const progressResponse = await fetch(`/api/progress?profileId=${params.profileId}`)
        if (!progressResponse.ok) throw new Error("Failed to fetch progress")
        const progressData = await progressResponse.json()
        setProgressRecords(progressData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.profileId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !notes.trim()) {
      toast.error("Compila tutti i campi obbligatori")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: params.profileId,
          date: format(date, "yyyy-MM-dd"),
          notes
        })
      })

      if (!response.ok) throw new Error("Failed to save progress")
      
      const newProgress = await response.json()
      setProgressRecords(prev => [newProgress, ...prev])
      setNotes("")
      setDate(new Date())
      
      toast.success("Progresso registrato con successo")
    } catch (error) {
      console.error("Error saving progress:", error)
      toast.error("Errore nel salvataggio del progresso")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (progressId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo record di progresso?")) return

    try {
      const response = await fetch(`/api/progress/${progressId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete progress")
      
      setProgressRecords(prev => prev.filter(p => p.id !== progressId))
      toast.success("Progresso eliminato con successo")
    } catch (error) {
      console.error("Error deleting progress:", error)
      toast.error("Errore nell'eliminazione del progresso")
    }
  }

  if (loading || !profile) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Progressi Allievo</h2>
          <p className="text-sm text-muted-foreground">
            {profile.userId}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Indietro
        </Button>
      </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium">Note sul Progresso</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descrivi i progressi dell'allievo..."
              className="min-h-[150px]"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvataggio..." : "Registra Progresso"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Storico Progressi</h3>
        {progressRecords.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Nessun progresso registrato
            </p>
          </Card>
        ) : (
          progressRecords.map((progress) => (
            <Card key={progress.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(progress.date), "d MMMM yyyy", { locale: it })}
                  </p>
                  <p className="whitespace-pre-wrap">{progress.notes}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(progress.id)}
                >
                  Elimina
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 