import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
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
  createdAt: Date
  updatedAt: Date
}

interface ProfileListProps {
  searchQuery: string
  onSelectProfile: (profileId: string) => void
  selectedProfile: string | null
  status?: "active" | "inactive"
}

export function ProfileList({
  searchQuery,
  onSelectProfile,
  selectedProfile,
  status,
}: ProfileListProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("search", searchQuery)
        if (status) params.append("status", status)

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
  }, [searchQuery, status])

  if (loading) {
    return <div className="flex items-center justify-center p-12">Caricamento...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista Profili</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer hover:bg-accent",
                    selectedProfile === profile.id && "bg-accent"
                  )}
                  onClick={() => onSelectProfile(profile.id)}
                >
                  <div className="font-medium">{profile.phone || "Nessun telefono"}</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.level ? `Livello: ${profile.level}` : "Nessun livello"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.preferredSport ? `Sport: ${profile.preferredSport}` : "Nessuno sport preferito"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                Nessun profilo trovato
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 