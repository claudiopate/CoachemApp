import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/bookings - Lista prenotazioni
export async function GET() {
  try {
    const { orgId } = await getAuth()

    const bookings = await db.booking.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        user: true,
        coach: true,
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[BOOKINGS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/bookings - Crea prenotazione
export async function POST(req: Request) {
  try {
    const { orgId, userId } = await getAuth()
    const body = await req.json()

    // Ottieni il profilo del coach (utente corrente)
    const coachProfile = await db.profile.findUnique({
      where: { userId }
    })

    if (!coachProfile) {
      return new NextResponse("Coach profile not found", { status: 404 })
    }

    // Ottieni il profilo del cliente
    const userProfile = await db.profile.findUnique({
      where: { id: body.userId }
    })

    if (!userProfile) {
      return new NextResponse("User profile not found", { status: 404 })
    }

    // Crea la prenotazione
    const booking = await db.booking.create({
      data: {
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        type: body.type,
        status: body.status,
        userId: userProfile.userId,
        coachId: coachProfile.userId,
        organizationId: orgId,
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
