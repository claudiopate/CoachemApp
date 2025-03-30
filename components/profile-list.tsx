"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileDialog } from "@/components/profile-dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"
import type { Profile } from "@/types"

interface ProfileListProps {
  profiles: Profile[]
  onProfileCreated?: (profile: Profile) => void
  onSelectProfile?: (profileId: string) => void
  selectedProfile?: string | null
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

export function ProfileList({ 
  profiles = [], 
  onProfileCreated,
  onSelectProfile,
  selectedProfile
}: ProfileListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

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
      onProfileCreated?.(newProfile)
      setDialogOpen(false)
      
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Profili</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuovo profilo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id} 
            className={selectedProfile === profile.id ? "ring-2 ring-primary" : undefined}
            onClick={() => onSelectProfile?.(profile.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {profile.level && (
                  <div>
                    <dt className="font-medium">Livello:</dt>
                    <dd className="capitalize">{profile.level}</dd>
                  </div>
                )}
                {profile.preferredSport && (
                  <div>
                    <dt className="font-medium">Sport preferito:</dt>
                    <dd className="capitalize">{profile.preferredSport}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium mb-1">Disponibilità:</dt>
                  <dd>
                    {days.map(day => {
                      const slots = profile.availability.filter(a => a.dayOfWeek === day.value)
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
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateProfile}
      />
    </div>
  )
}
