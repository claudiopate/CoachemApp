"use client"

import { useOrganizationList, useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SelectOrgPage() {
  const { organizationList, isLoaded } = useOrganizationList()
  const { organization } = useOrganization()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Benvenuto in Coachem</h1>
          <p className="text-muted-foreground mt-2">
            Seleziona un'organizzazione o creane una nuova per iniziare
          </p>
        </div>

        <div className="grid gap-4">
          {organizationList?.map((org) => (
            <Card
              key={org.organization.id}
              className={`cursor-pointer transition-colors ${
                organization?.id === org.organization.id
                  ? "border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => router.push(`/dashboard?org=${org.organization.id}`)}
            >
              <CardHeader>
                <CardTitle>{org.organization.name}</CardTitle>
                <CardDescription>
                  {org.organization.membersCount} membri
                </CardDescription>
              </CardHeader>
            </Card>
          ))}

          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => router.push("/create-org")}
          >
            <CardContent className="flex items-center justify-center p-6">
              <Button variant="ghost" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Crea una nuova organizzazione
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 