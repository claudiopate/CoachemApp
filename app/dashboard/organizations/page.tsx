"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useOrganizationList, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { CreateOrganizationModal } from "@/components/create-organization-modal"

export default function OrganizationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard"
  const { organizationList, isLoaded, setActive } = useOrganizationList()
  const { user } = useUser()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Reindirizza automaticamente se l'utente ha una sola organizzazione
  useEffect(() => {
    if (isLoaded && organizationList.count === 1) {
      setActive({ organization: organizationList.items[0].organization }).then(() => router.push(redirectUrl))
    }
  }, [isLoaded, organizationList, setActive, router, redirectUrl])

  const handleSelectOrganization = async (organizationId: string) => {
    await setActive({ organization: organizationId })
    router.push(redirectUrl)
  }

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Select a Club</h1>
          <p className="text-muted-foreground mt-2">Choose a club to continue or create a new one</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Club
        </Button>
      </div>

      {organizationList.count === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No clubs found</h2>
          <p className="text-muted-foreground mb-6">
            You don't belong to any clubs yet. Create your first club to get started.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationList.items.map(({ organization }) => (
            <Card key={organization.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>
                  {organization.membersCount} {organization.membersCount === 1 ? "member" : "members"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {organization.imageUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <img
                      src={organization.imageUrl || "/placeholder.svg"}
                      alt={organization.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSelectOrganization(organization.id)}>
                  Select Club
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateOrganizationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}

