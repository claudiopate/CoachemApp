"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOrganizationList } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, School, Users } from "lucide-react"

type CreateOrganizationModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const router = useRouter()
  const { createOrganization, setActive } = useOrganizationList()
  const [orgName, setOrgName] = useState("")
  const [orgType, setOrgType] = useState("club")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orgName.trim()) {
      setError("Il nome dell'organizzazione è obbligatorio")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Crea l'organizzazione
      const organization = await createOrganization({
        name: orgName,
        // Puoi aggiungere metadati per il tipo di organizzazione
        metadata: {
          type: orgType,
        },
      })

      // Imposta l'organizzazione come attiva
      await setActive({ organization: organization.id })

      // Chiudi il modale e reindirizza al dashboard
      onClose()
      router.push("/dashboard")
    } catch (error) {
      console.error("Errore durante la creazione dell'organizzazione:", error)
      setError("Impossibile creare l'organizzazione. Riprova più tardi.")
    } finally {
      setIsLoading(false)
    }
  }

  const getOrgTypeIcon = () => {
    switch (orgType) {
      case "club":
        return <Building className="h-4 w-4 mr-2" />
      case "school":
        return <School className="h-4 w-4 mr-2" />
      case "team":
        return <Users className="h-4 w-4 mr-2" />
      default:
        return <Building className="h-4 w-4 mr-2" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crea una Nuova Organizzazione</DialogTitle>
          <DialogDescription>Crea un'organizzazione per gestire i tuoi allenatori e studenti</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nome dell'Organizzazione</Label>
              <Input
                id="orgName"
                placeholder="Inserisci il nome dell'organizzazione"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Tipo di Organizzazione</Label>
              <Select value={orgType} onValueChange={setOrgType}>
                <SelectTrigger id="orgType" className="focus-visible:ring-primary">
                  <SelectValue placeholder="Seleziona il tipo di organizzazione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="club" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Club Sportivo
                  </SelectItem>
                  <SelectItem value="school" className="flex items-center">
                    <School className="h-4 w-4 mr-2" />
                    Scuola
                  </SelectItem>
                  <SelectItem value="team" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Gruppo di Lavoro
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {getOrgTypeIcon()}
              {isLoading ? "Creazione in corso..." : "Crea Organizzazione"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

