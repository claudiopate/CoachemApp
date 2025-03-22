import type React from "react"
import { redirect } from "next/navigation"
import { auth, currentUser, OrganizationProfile } from "@clerk/nextjs"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { OrganizationSwitcher } from "@/components/organization-switcher"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, orgId } = auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  // Se l'utente non ha selezionato un'organizzazione, reindirizza alla pagina di selezione
  if (!orgId) {
    redirect("/dashboard/organizations")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">CourtTime</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-[200px]">
              <OrganizationSwitcher />
            </div>
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6">
          <OrganizationProfile />
          {children}
        </main>
      </div>
    </div>
  )
}

