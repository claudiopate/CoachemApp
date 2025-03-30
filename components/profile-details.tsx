import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  userId: string
  phone: string | null
  level: string | null
  preferredSport: string | null
  preferredDays: string[]
  preferredTimes: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface ProfileDetailsProps {
  profileId: string
}

export function ProfileDetails({ profileId }: ProfileDetailsProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Profile>>({})
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${profileId}`)
        if (!response.ok) throw new Error("Errore nel caricamento del profilo")
        const data = await response.json()
        setProfile(data)
        setFormData(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Errore nel caricamento del profilo")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [profileId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Errore nell'aggiornamento del profilo")
      const data = await response.json()
      setProfile(data)
      setIsEditing(false)
      toast.success("Profilo aggiornato con successo")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Errore nell'aggiornamento del profilo")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questo profilo?")) return

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Errore nell'eliminazione del profilo")
      toast.success("Profilo eliminato con successo")
      router.push("/profiles")
    } catch (error) {
      console.error("Error deleting profile:", error)
      toast.error("Errore nell'eliminazione del profilo")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  if (!profile) {
    return <div className="flex items-center justify-center p-12">Profilo non trovato</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dettagli Profilo</h2>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Elimina Profilo
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={profile.userId}
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="level">Livello</Label>
          <Select
            value={formData.level || ""}
            onValueChange={(value) => setFormData({ ...formData, level: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona livello" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Principiante</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="preferredSport">Sport Preferito</Label>
          <Select
            value={formData.preferredSport || ""}
            onValueChange={(value) => setFormData({ ...formData, preferredSport: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="padel">Padel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Note</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annulla
            </Button>
            <Button type="submit">Salva Modifiche</Button>
          </>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Modifica Profilo
          </Button>
        )}
      </div>
    </form>
  )
} 