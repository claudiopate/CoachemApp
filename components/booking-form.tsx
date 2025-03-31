"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileDialog } from "@/components/profile-dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"

interface Profile {
  id: string
  name: string
  email: string
  image?: string
  level?: string
  preferredSport?: string
  availability: Array<{
    id: string
    dayOfWeek: string
    startTime: string
    endTime: string
  }>
}

interface BookingFormProps {
  initialData?: {
    id: string
    date: Date
    startTime: string
    endTime: string
    type: string
    status: string
  }
  onSubmit: (data: any) => void
  onCancel?: () => void
}

const days = [
  { value: "monday", label: "Lunedì" },
  { value: "tuesday", label: "Martedì" },
  { value: "wednesday", label: "Mercoledì" },
  { value: "thursday", label: "Giovedì" },
  { value: "friday", label: "Venerdì" },
  { value: "saturday", label: "Sabato" },
  { value: "sunday", label: "Domenica" },
]

export function BookingForm({ initialData, onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || "09:00",
    endTime: initialData?.endTime || "10:00",
    type: initialData?.type || "tennis",
    status: initialData?.status || "pending",
    userId: "",
  })
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Aggiungiamo un ref per tenere traccia del profilo appena creato
  const [lastCreatedProfile, setLastCreatedProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/profiles")
        if (!response.ok) throw new Error("Failed to fetch profiles")
        const data = await response.json()
        setProfiles(data)
      } catch (error) {
        console.error("Error fetching profiles:", error)
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Impossibile caricare i profili"
        })
      }
    }

    fetchProfiles()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Seleziona un profilo per la prenotazione"
      })
      return
    }

    // Combiniamo la data con l'ora di inizio per creare una data ISO completa
    const fullDate = new Date(formData.date + 'T' + formData.startTime)
    
    onSubmit({
      ...formData,
      date: fullDate.toISOString(),
    })
  }

  const handleCreateProfile = async (profileData: any) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) throw new Error("Failed to create profile")

      const newProfile = await response.json()
      setProfiles([...profiles, newProfile])
      setLastCreatedProfile(newProfile) // Salviamo il profilo appena creato
      setDialogOpen(false) // Chiudiamo la dialog
      
      // Selezioniamo automaticamente il nuovo profilo
      setFormData({ ...formData, userId: newProfile.id })
      
      toast({
        title: "Profilo creato",
        description: "Il nuovo profilo è stato creato e selezionato per la prenotazione"
      })
    } catch (error) {
      console.error("Error creating profile:", error)
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile creare il profilo"
      })
    }
  }

  const selectedProfile = profiles.find(p => p.id === formData.userId)
  const selectedDay = selectedProfile?.availability.find(
    a => a.dayOfWeek === new Date(formData.date)
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase()
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Cliente</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuovo profilo
          </Button>
        </div>
        <Select
          value={formData.userId}
          onValueChange={(value) => setFormData({ ...formData, userId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona il cliente" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem 
                key={profile.id} 
                value={profile.id}
                className={lastCreatedProfile?.id === profile.id ? "bg-muted" : ""}
              >
                {profile.name} ({profile.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProfile && (
        <div className="rounded-lg border p-4 space-y-2">
          <h4 className="font-medium">Preferenze del cliente</h4>
          {selectedProfile.preferredSport && (
            <p className="text-sm">Sport: {selectedProfile.preferredSport}</p>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">Disponibilità:</p>
            {days.map(day => {
              const slots = selectedProfile.availability.filter(a => a.dayOfWeek === day.value)
              if (slots.length === 0) return null
              
              return (
                <div key={day.value} className="text-sm">
                  <span className="font-medium">{day.label}:</span>{" "}
                  {slots.map((slot, i) => (
                    <span key={slot.id}>
                      {slot.startTime}-{slot.endTime}
                      {i < slots.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Data</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ora Inizio</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
          {selectedDay && (formData.startTime < selectedDay.startTime || formData.startTime > selectedDay.endTime) && (
            <p className="text-sm text-destructive">
              L'orario selezionato è fuori dalla disponibilità del cliente ({selectedDay.startTime}-{selectedDay.endTime})
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Ora Fine</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
          {selectedDay && (formData.endTime < selectedDay.startTime || formData.endTime > selectedDay.endTime) && (
            <p className="text-sm text-destructive">
              L'orario selezionato è fuori dalla disponibilità del cliente ({selectedDay.startTime}-{selectedDay.endTime})
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="padel">Padel</SelectItem>
            <SelectItem value="pickleball">Pickleball</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Stato</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="confirmed">Confermata</SelectItem>
            <SelectItem value="completed">Completata</SelectItem>
            <SelectItem value="cancelled">Cancellata</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        )}
        <Button type="submit">
          {initialData ? "Aggiorna" : "Crea"} Prenotazione
        </Button>
      </div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateProfile}
      />
    </form>
  )
}
