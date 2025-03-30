"use client"

import { useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateOrgPage() {
  const { createOrganization } = useOrganization()
  const router = useRouter()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createOrganization({ name })
      router.push("/dashboard")
    } catch (error) {
      console.error("Errore nella creazione dell'organizzazione:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Crea una nuova organizzazione</CardTitle>
          <CardDescription>
            Inserisci il nome della tua organizzazione per iniziare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome organizzazione</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Es. Tennis Club Roma"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creazione in corso..." : "Crea organizzazione"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 