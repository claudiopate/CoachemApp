import { currentUser, auth, clerkClient } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentBookings } from "@/components/recent-bookings"
import { supabase } from "@/lib/supabase"

export default async function DashboardPage() {
  const user = await currentUser()
  const { orgId } = auth()

  if (!orgId) {
    return null // Gestito dal middleware
  }

  // Ottieni il nome dell'organizzazione
  const organization = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  // Ottieni le statistiche per questa organizzazione
  const { data: bookingsCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact" })
    .eq("organization_id", orgId)

  const { data: studentsCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact" })
    .eq("organization_id", orgId)
    .neq("user_id", user?.id || "")

  // Altre statistiche...

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to {organization.name}</p>
        </div>
        <CalendarDateRangePicker />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 18.85v-10.5c0-1 .65-1.5 1.5-1.5.82 0 1.5.67 1.5 1.5v10.5" />
              <path d="M12 18.85v-10.5c0-1 .65-1.5 1.5-1.5.82 0 1.5.67 1.5 1.5v10.5" />
              <path d="M16 18.85v-10.5c0-1 .65-1.5 1.5-1.5.82 0 1.5.67 1.5 1.5v10.5" />
              <path d="M5 8.85h14" />
              <path d="M6 4.85h12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingsCount?.count || 0}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>

        {/* Altre card... */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Booking trends over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview organizationId={orgId} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your most recent lesson bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings organizationId={orgId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

