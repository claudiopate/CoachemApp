"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOrganizationList, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Building, Users, Calendar } from "lucide-react"
import { CreateOrganizationModal } from "@/components/create-organization-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function OrganizationsPage() {
  const router = useRouter()
  const { organizationList, isLoaded, setActive } = useOrganizationList()
  const { user } = useUser()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Reindirizza automaticamente se l'utente ha una sola organizzazione
  useEffect(() => {
    if (isLoaded && organizationList.count === 1 && !isRedirecting) {
      setIsRedirecting(true)
      setActive({ organization: organizationList.items[0].organization })
        .then(() => router.push("/dashboard"))
        .catch((err) => {
          console.error("Errore nel selezionare l'organizzazione:", err)
          setIsRedirecting(false)
        })
    }
  }, [isLoaded, organizationList, setActive, router, isRedirecting])

  const handleSelectOrganization = async (organizationId: string) => {
    try {
      setIsRedirecting(true)
      await setActive({ organization: organizationId })
      router.push("/dashboard")
    } catch (error) {
      console.error("Errore nel selezionare l'organizzazione:", error)
      setIsRedirecting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-16 w-16 rounded-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Le tue Organizzazioni</h1>
          <p className="text-muted-foreground mt-1">Seleziona un'organizzazione esistente o creane una nuova</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Crea Organizzazione
        </Button>
      </div>

      {organizationList.count === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <Building className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Nessuna organizzazione trovata</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Non appartieni ancora a nessuna organizzazione. Crea la tua prima organizzazione per iniziare a gestire i
            tuoi corsi.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Crea la tua prima Organizzazione
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {organizationList.items.map(({ organization }) => (
            <motion.div key={organization.id} variants={item}>
              <Card className="overflow-hidden card-hover">
                <CardHeader className="pb-2">
                  <CardTitle>{organization.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {organization.membersCount} {organization.membersCount === 1 ? "membro" : "membri"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-4">
                    {organization.imageUrl ? (
                      <div className="h-16 w-16 rounded-full overflow-hidden border">
                        <img
                          src={organization.imageUrl || "/placeholder.svg"}
                          alt={organization.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Building className="h-8 w-8" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Creata il {new Date(organization.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleSelectOrganization(organization.id)}
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? "Selezione in corso..." : "Seleziona Organizzazione"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <CreateOrganizationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}

