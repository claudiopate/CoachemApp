"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ProfileList } from "@/components/profile-list"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Profile } from "@/types"

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false)
  const { toast } = useToast()

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles")
      if (!response.ok) throw new Error("Failed to fetch profiles")
      const data = await response.json()
      setProfiles(data)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.level?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.preferredSport?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      preferredSport: formData.get("preferredSport"),
      level: formData.get("level"),
      preferredTimes: formData.get("preferredTimes"),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create profile")
      }

      toast({
        title: "Profilo creato",
        description: "Il nuovo profilo è stato creato con successo",
      })
      setIsNewProfileOpen(false)
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del profilo",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profili</h1>
        <Dialog open={isNewProfileOpen} onOpenChange={setIsNewProfileOpen}>
          <DialogTrigger asChild>
            <Button>Nuovo Profilo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea nuovo profilo</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli del nuovo profilo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredSport">Sport preferito</Label>
                <Input id="preferredSport" name="preferredSport" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Livello</Label>
                <Input id="level" name="level" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTimes">Orari preferiti</Label>
                <Input id="preferredTimes" name="preferredTimes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Note</Label>
                <Input id="notes" name="notes" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNewProfileOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  Crea Profilo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Cerca profili..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <ProfileList 
            profiles={filteredProfiles}
            onProfileCreated={fetchProfiles}
            onSelectProfile={setSelectedProfile}
            selectedProfile={selectedProfile}
          />
        </div>
      )}
    </div>
  )
}
