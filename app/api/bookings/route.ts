import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth, clerkClient } from "@clerk/nextjs"

export async function GET() {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Ottieni il ruolo dell'utente nell'organizzazione
    const membership = await clerkClient.organizations.getOrganizationMembership({
      organizationId: orgId,
      userId,
    })

    const role = membership.role

    let query = supabase
      .from("bookings")
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq("organization_id", orgId)

    // Filtra in base al ruolo
    if (role === "coach") {
      // Gli allenatori vedono solo le loro prenotazioni
      query = query.eq("coach_id", userId)
    } else if (role === "student") {
      // Gli studenti vedono solo le loro prenotazioni
      query = query.eq("user_id", userId)
    }
    // Gli admin vedono tutte le prenotazioni dell'organizzazione

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Verifica il ruolo dell'utente
    const membership = await clerkClient.organizations.getOrganizationMembership({
      organizationId: orgId,
      userId,
    })

    const role = membership.role

    // Solo admin e coach possono creare prenotazioni
    if (role !== "admin" && role !== "coach") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { date, startTime, endTime, type, court, studentId, notes } = body

    // Validate input
    if (!date || !startTime || !endTime || !type || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        date,
        start_time: startTime,
        end_time: endTime,
        type,
        court,
        status: "pending",
        notes,
        user_id: studentId,
        coach_id: userId,
        organization_id: orgId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

