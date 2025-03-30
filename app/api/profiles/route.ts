import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/profiles - Lista profili
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

    const profiles = await db.profile.findMany({
      where,
      include: {
        bookings: true,
        coaching: true,
        progressRecords: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("[PROFILES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST /api/profiles - Crea profilo
export async function POST(req: Request) {
  try {
    const { orgId, userId } = await getAuth()
    const { phone, level, preferredSport, preferredDays, preferredTimes, notes } = await req.json()

    const profile = await db.profile.create({
      data: {
        userId,
        organizationId: orgId,
        phone,
        level,
        preferredSport,
        preferredDays,
        preferredTimes,
        notes
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 