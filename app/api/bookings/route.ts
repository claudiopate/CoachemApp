"use server"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth, getCurrentProfile } from "@/lib/auth"

// GET /api/bookings - Lista prenotazioni
export async function GET() {
  try {
    const { orgId } = await getAuth()

    const bookings = await db.booking.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        profile: true,
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[BOOKINGS_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/bookings - Crea prenotazione
export async function POST(req: Request) {
  try {
    const { orgId } = await getAuth()
    const body = await req.json()

    const { date, startTime, endTime, type, userId } = body

    if (!date || !startTime || !endTime || !type || !userId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Usa getCurrentProfile per trovare il profilo
    const profile = await getCurrentProfile()

    if (!profile) {
      console.error("[PROFILE_NOT_FOUND]", { userId, orgId })
      return new NextResponse("Profile not found", { status: 404 })
    }

    const booking = await db.booking.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        type,
        profileId: profile.id,
        organizationId: orgId,
        status: body.status || "pending"
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json(booking)
  } catch (error: any) {
    console.error("[BOOKINGS_POST]", error)
    if (error?.message === "Profile not found") {
      return new NextResponse(error.message, { status: 404 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
