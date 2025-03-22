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

type CreateOrganizationModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const router = useRouter()
  const { createOrganization } = useOrganizationList()
  const [clubName, setClubName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clubName.trim()) {
      setError("Club name is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const organization = await createOrganization({ name: clubName })
      router.push("/dashboard")
      onClose()
    } catch (error) {
      console.error("Error creating club:", error)
      setError("Failed to create club. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Club</DialogTitle>
          <DialogDescription>Create a club to manage your coaches and students</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                placeholder="Enter club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

