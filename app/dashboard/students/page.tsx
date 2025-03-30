"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileList } from "@/components/profile-list"
import { ProfileDetails } from "@/components/profile-details"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profili</h1>
        <Button>Nuovo Profilo</Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Cerca profili..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
  )
}

