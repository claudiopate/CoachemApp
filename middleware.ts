import { authMiddleware } from "@clerk/nextjs"
import { clerkClient } from "@clerk/clerk-sdk-node"
import { NextResponse } from "next/server"
import { AuthObject } from "@clerk/nextjs/server"

// Definisci le rotte che richiedono ruoli specifici
const isCoachRoute = (pathname: string) => {
  return pathname.startsWith("/dashboard/students/") || pathname === "/dashboard/calendar"
}

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith("/dashboard/settings/club/")
}

export default authMiddleware({
  publicRoutes: ["/", "/about", "/api/webhook/clerk"],
  async afterAuth(auth: AuthObject & { isPublicRoute: boolean; isApiRoute: boolean }, req: Request) {
    // Gestisci le rotte che richiedono ruoli specifici
    if (!auth.userId && !auth.isPublicRoute) {
      // L'utente non è autenticato e la rotta non è pubblica
      return
    }

    if (auth.userId && !auth.orgId) {
      // L'utente è autenticato ma non ha selezionato un'organizzazione
      const { pathname } = new URL(req.url)

      // Se l'utente sta cercando di accedere a una rotta che richiede un'organizzazione
      if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/organizations") {
        const url = new URL("/dashboard/organizations", req.url)
        url.searchParams.set("redirect_url", pathname)
        return NextResponse.redirect(url)
      }
    }

    // Verifica i ruoli per le rotte protette
    if (auth.userId && auth.orgId) {
      const orgMembership = await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: auth.orgId,
        userId: auth.userId,
      })

      const userRole = orgMembership[0]?.role
      const { pathname } = new URL(req.url)

      // Verifica se l'utente ha il ruolo richiesto per la rotta
      if (isCoachRoute(pathname) && userRole !== "admin" && userRole !== "coach") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      if (isAdminRoute(pathname) && userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

