"use client"

import { useEffect, useState } from "react"
import { useUser, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingCalendar } from "@/components/booking-calendar"
import { ProfileList } from "@/components/profile-list"
import { CreateOrganizationModal } from "@/components/create-organization-modal"
import { InviteMemberModal } from "@/components/invite-member-modal"
import { Building, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileDetails } from "@/components/profile-details"

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization, isLoaded: isOrgLoaded } = useOrganization()
  const router = useRouter()
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  useEffect(() => {
    if (isUserLoaded && !user) {
      router.push("/login")
    }
  }, [isUserLoaded, user, router])

  if (!isUserLoaded || !isOrgLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!organization) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Benvenuto in Coachem</h1>
          <p className="text-muted-foreground">
            Per iniziare, devi creare o selezionare un'organizzazione
          </p>
          <Button onClick={() => router.push("/select-org")}>
            Seleziona o crea un'organizzazione
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">
            Gestisci i tuoi profili e le prenotazioni
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Invita Membro
          </Button>
          <Button onClick={() => setIsCreateOrgModalOpen(true)}>
            <Building className="mr-2 h-4 w-4" />
            Nuova Organizzazione
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prossime Prenotazioni
            </CardTitle>
            <CardDescription>
              Visualizza e gestisci le prenotazioni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingCalendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista Profili
            </CardTitle>
            <CardDescription>
              Gestisci i tuoi profili
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Cerca profili..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">Tutti</TabsTrigger>
                  <TabsTrigger value="active">Attivi</TabsTrigger>
                  <TabsTrigger value="inactive">Inattivi</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ProfileList
                        searchQuery={searchQuery}
                        onSelectProfile={setSelectedProfile}
                        selectedProfile={selectedProfile}
                      />
                    </div>
                    <div>
                      {selectedProfile ? (
                        <ProfileDetails profileId={selectedProfile} />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Seleziona un profilo per visualizzare i dettagli
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ProfileList
                        searchQuery={searchQuery}
                        onSelectProfile={setSelectedProfile}
                        selectedProfile={selectedProfile}
                        status="active"
                      />
                    </div>
                    <div>
                      {selectedProfile ? (
                        <ProfileDetails profileId={selectedProfile} />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Seleziona un profilo per visualizzare i dettagli
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inactive" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ProfileList
                        searchQuery={searchQuery}
                        onSelectProfile={setSelectedProfile}
                        selectedProfile={selectedProfile}
                        status="inactive"
                      />
                    </div>
                    <div>
                      {selectedProfile ? (
                        <ProfileDetails profileId={selectedProfile} />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Seleziona un profilo per visualizzare i dettagli
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateOrganizationModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  )
}

