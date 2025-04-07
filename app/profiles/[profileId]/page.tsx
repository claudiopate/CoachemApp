"use client"

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Profile {
  id: string
  userId: string
  phone: string | null
  level: string | null
  preferredSport: string | null
  preferredDays: string[]
  preferredTimes: string | null
  notes: string | null
  organizationId: string | null
  createdAt: Date
  updatedAt: Date
  bookings: any[]
  coaching: any[]
  progressRecords: any[]
}

export default function ProfilePage(props: { params: Promise<{ profileId: string }> }) {
  const params = use(props.params);
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${params.profileId}`)
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Errore nel caricamento del profilo")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.profileId])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    try {
      const response = await fetch(`/api/profiles/${params.profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: profile.phone,
          level: profile.level,
          preferredSport: profile.preferredSport,
          preferredDays: profile.preferredDays,
          preferredTimes: profile.preferredTimes,
          notes: profile.notes
        })
      })

      if (!response.ok) throw new Error("Failed to update profile")
      toast.success("Profilo aggiornato con successo")
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Errore nell'aggiornamento del profilo")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questo profilo?")) return

    try {
      const response = await fetch(`/api/profiles/${params.profileId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete profile")
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dettagli Profilo</h2>
        <Button variant="destructive" onClick={onDelete}>
          Elimina Profilo
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informazioni</TabsTrigger>
          <TabsTrigger value="bookings">Prenotazioni ({profile.bookings.length})</TabsTrigger>
          <TabsTrigger value="coaching">Lezioni ({profile.coaching.length})</TabsTrigger>
          <TabsTrigger value="progress">Progressi ({profile.progressRecords.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <form onSubmit={onSubmit} className="space-y-4">
            <Card className="p-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Livello</Label>
                  <Input
                    id="level"
                    value={profile.level || ""}
                    onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sport">Sport Preferito</Label>
                  <Input
                    id="sport"
                    value={profile.preferredSport || ""}
                    onChange={(e) => setProfile({ ...profile, preferredSport: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="times">Orari Preferiti</Label>
                  <Input
                    id="times"
                    value={profile.preferredTimes || ""}
                    onChange={(e) => setProfile({ ...profile, preferredTimes: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Note</Label>
                  <Textarea
                    id="notes"
                    value={profile.notes || ""}
                    onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </div>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="space-y-4">
            {profile.bookings.length > 0 ? (
              profile.bookings.map((booking: any) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString("it-IT")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <Badge variant={booking.status === "completed" ? "secondary" : "default"}>
                      {booking.status}
                    </Badge>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  Nessuna prenotazione trovata
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="coaching">
          <div className="space-y-4">
            {profile.coaching.length > 0 ? (
              profile.coaching.map((session: any) => (
                <Card key={session.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(session.date).toLocaleDateString("it-IT")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </p>
                    </div>
                    <Badge variant={session.status === "completed" ? "secondary" : "default"}>
                      {session.status}
                    </Badge>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  Nessuna lezione trovata
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            {profile.progressRecords.length > 0 ? (
              profile.progressRecords.map((record: any) => (
                <Card key={record.id} className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString("it-IT")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.notes}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  Nessun progresso registrato
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 