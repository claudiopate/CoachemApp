"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useClerk } from "@clerk/nextjs"

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url")

  useEffect(() => {
    async function handleCallback() {
      try {
        await handleRedirectCallback({
          redirectUrl: redirectUrl || "/dashboard",
        })
      } catch (err) {
        console.error("OAuth error", err)
        router.push("/login?error=oauth-error")
      }
    }

    handleCallback()
  }, [handleRedirectCallback, router, redirectUrl])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completamento autenticazione in corso...</p>
      </div>
    </div>
  )
} 