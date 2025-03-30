import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/bookings - Lista prenotazioni
export async function GET(req: Request) {
  try {
    const { orgId } = await getAuth()
    const { searchParams } = new URL(req.url)
    
    const userId = searchParams.get("userId")
    const coachId = searchParams.get("coachId")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where = {
      organizationId: orgId,
      ...(userId && { userId }),
      ...(coachId && { coachId }),
      ...(status && { status }),
      ...(type && { type }),
      ...(from && to && {
        date: {
          gte: new Date(from),
          lte: new Date(to)
        }
      })
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        user: true,
        coach: true,
        attendance: true
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[BOOKINGS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST /api/bookings - Crea prenotazione
export async function POST(req: Request) {
  try {
    const { orgId } = await getAuth()
    const { userId, coachId, date, startTime, endTime, type } = await req.json()

    const booking = await db.booking.create({
      data: {
        userId,
        coachId,
        organizationId: orgId,
        date: new Date(date),
        startTime,
        endTime,
        type
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKINGS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

