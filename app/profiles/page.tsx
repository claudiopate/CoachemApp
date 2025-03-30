"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileCard } from "@/components/profile-card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({
    phone: "",
    level: "",
    preferredSport: "",
    notes: ""
  })
  const router = useRouter()

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("search", searchQuery)
        if (activeTab !== "all") params.append("status", activeTab)

        const response = await fetch(`/api/profiles?${params.toString()}`)
        if (!response.ok) throw new Error("Errore nel caricamento dei profili")
        const data = await response.json()
        setProfiles(data)
      } catch (error) {
        console.error("Error fetching profiles:", error)
        toast.error("Errore nel caricamento dei profili")
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [searchQuery, activeTab])

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      })

      if (!response.ok) throw new Error("Errore nella creazione del profilo")
      const data = await response.json()
      setProfiles([...profiles, data])
      setIsCreateDialogOpen(false)
      setNewProfile({
        phone: "",
        level: "",
        preferredSport: "",
        notes: ""
      })
      toast.success("Profilo creato con successo")
    } catch (error) {
      console.error("Error creating profile:", error)
      toast.error("Errore nella creazione del profilo")
    }
  }

  const activeProfiles = profiles.filter(profile => profile.level !== null)
  const inactiveProfiles = profiles.filter(profile => profile.level === null)

  if (loading) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profili</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nuovo Profilo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Profilo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={newProfile.phone}
                  onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Livello</Label>
                <Select
                  value={newProfile.level}
                  onValueChange={(value) => setNewProfile({ ...newProfile, level: value })}
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
                <Label htmlFor="sport">Sport Preferito</Label>
                <Select
                  value={newProfile.preferredSport}
                  onValueChange={(value) => setNewProfile({ ...newProfile, preferredSport: value })}
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
                  value={newProfile.notes}
                  onChange={(e) => setNewProfile({ ...newProfile, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit">Crea Profilo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Cerca profili..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tutti</TabsTrigger>
          <TabsTrigger value="active">Attivi</TabsTrigger>
          <TabsTrigger value="inactive">Inattivi</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  name={profile.userId}
                  email={profile.userId}
                  role={profile.level || "Non specificato"}
                  status="active"
                  onClick={() => router.push(`/profiles/${profile.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="rounded-lg border p-8">
                  <p className="text-center text-muted-foreground">
                    Nessun profilo trovato
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProfiles.length > 0 ? (
              activeProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  name={profile.userId}
                  email={profile.userId}
                  role={profile.level || "Non specificato"}
                  status="active"
                  onClick={() => router.push(`/profiles/${profile.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="rounded-lg border p-8">
                  <p className="text-center text-muted-foreground">
                    Nessun profilo attivo trovato
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveProfiles.length > 0 ? (
              inactiveProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  name={profile.userId}
                  email={profile.userId}
                  role="Non specificato"
                  status="inactive"
                  onClick={() => router.push(`/profiles/${profile.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="rounded-lg border p-8">
                  <p className="text-center text-muted-foreground">
                    Nessun profilo inattivo trovato
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 