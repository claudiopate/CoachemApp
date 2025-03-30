import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

// GET /api/bookings - Ottieni tutte le prenotazioni dell'organizzazione
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const { userId, orgId } = getAuth(request)

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        organizationId: orgId,
        OR: [
          {
            userId: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            coachId: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[BOOKINGS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/bookings - Crea una nuova prenotazione
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request)

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { userId: bookingUserId, coachId, date, startTime, endTime, type = "lesson", status = "upcoming" } = body

    const booking = await prisma.booking.create({
      data: {
        userId: bookingUserId,
        coachId,
        organizationId: orgId,
        date,
        startTime,
        endTime,
        type,
        status,
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

