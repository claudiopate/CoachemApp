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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/profiles")
        if (!response.ok) throw new Error("Failed to fetch profiles")
        const data = await response.json()
        setProfiles(data)
      } catch (error) {
        console.error("Error fetching profiles:", error)
      }
    }

    fetchProfiles()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
      setFormData({ ...formData, userId: newProfile.id })
      
      toast({
        title: "Profilo creato",
        description: "Il nuovo profilo è stato creato con successo",
      })
    } catch (error) {
      console.error("Error creating profile:", error)
      toast({
        title: "Errore",
        description: "Impossibile creare il profilo",
        variant: "destructive",
      })
    }
  }

  const selectedProfile = profiles.find(p => p.id === formData.userId)
  const selectedDay = selectedProfile?.availability.find(
    a => a.dayOfWeek === new Date(formData.date).toLocaleDateString('en-US', { weekday: 'lowercase' })
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="userId">Cliente</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
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
              <SelectItem key={profile.id} value={profile.id}>
                <div className="flex items-center gap-2">
                  {profile.image && (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <div>
                    <span>{profile.name}</span>
                    {profile.level && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({profile.level})
                      </span>
                    )}
                  </div>
                </div>
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
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Ora inizio</Label>
        <Input
          id="startTime"
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
        <Label htmlFor="endTime">Ora fine</Label>
        <Input
          id="endTime"
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

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona il tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="padel">Padel</SelectItem>
            <SelectItem value="pickleball">Pickleball</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Stato</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona lo stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="confirmed">Confermata</SelectItem>
            <SelectItem value="completed">Completata</SelectItem>
            <SelectItem value="cancelled">Cancellata</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        )}
        <Button type="submit">
          {initialData ? "Aggiorna" : "Crea"}
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
