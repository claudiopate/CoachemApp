"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, Phone } from "lucide-react"

type ProfileDetailsProps = {
  profileId: string
}

// Mock data for profile details
const profilesData = {
  "1": {
    id: "1",
    name: "Marco Rossi",
    email: "marco.rossi@example.com",
    phone: "+39 123 456 7890",
    image: "/avatars/marco.jpg",
    preferredSport: "Tennis",
    level: "Intermedio",
    status: "active",
    preferredDays: ["Lunedì", "Mercoledì", "Venerdì"],
    preferredTimes: "18:00 - 20:00",
    notes: "Preferisce lezioni serali dopo il lavoro"
  },
  "2": {
    id: "2",
    name: "Laura Bianchi",
    email: "laura.b@example.com",
    phone: "+39 234 567 8901",
    image: "/avatars/laura.jpg",
    preferredSport: "Padel",
    level: "Principiante",
    status: "active",
    preferredDays: ["Martedì", "Giovedì"],
    preferredTimes: "17:00 - 19:00",
    notes: "Ha bisogno di noleggiare l'attrezzatura"
  },
  "3": {
    id: "3",
    name: "Giuseppe Verdi",
    email: "g.verdi@example.com",
    phone: "+39 345 678 9012",
    image: "/avatars/giuseppe.jpg",
    preferredSport: "Tennis",
    level: "Avanzato",
    status: "inactive",
    preferredDays: ["Sabato", "Domenica"],
    preferredTimes: "10:00 - 12:00",
    notes: "Preferisce lezioni nel weekend"
  }
}

export function ProfileDetails({ profileId }: ProfileDetailsProps) {
  const profile = profilesData[profileId as keyof typeof profilesData]

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Profilo non trovato</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profilo</TabsTrigger>
        <TabsTrigger value="attendance">Frequenza</TabsTrigger>
        <TabsTrigger value="progress">Progressi</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.image} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <Button size="sm" variant="outline" className="gap-1">
                <Edit className="h-4 w-4" /> Modifica
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{profile.preferredSport}</Badge>
              <Badge variant="outline">{profile.level}</Badge>
              <Badge variant={profile.status === "active" ? "default" : "secondary"}>{profile.status}</Badge>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferenze</CardTitle>
            <CardDescription>Preferenze e disponibilità del profilo</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Giorni preferiti</h3>
              <div className="flex flex-wrap gap-1">
                {profile.preferredDays.map((day) => (
                  <Badge key={day} variant="outline">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Orari preferiti</h3>
              <p>{profile.preferredTimes}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Note</h3>
              <p className="text-muted-foreground">{profile.notes}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendance" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Frequenza</CardTitle>
            <CardDescription>Registro delle presenze</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: aggiungere dati di frequenza */}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Progressi</CardTitle>
            <CardDescription>Progressi del profilo in diverse abilità</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: aggiungere dati di progressi */}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
