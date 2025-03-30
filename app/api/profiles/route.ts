import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { type Prisma } from "@prisma/client"

// GET /api/profiles - Lista profili
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const profiles = await db.profile.findMany({
      where: { organizationId: orgId },
      include: {
        availability: true
      } as Prisma.ProfileInclude
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("[PROFILES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

type ProfileInput = {
  name: string
  email: string
  phone?: string
  level?: string
  preferredSport?: string
  notes?: string
  availability?: Array<{
    dayOfWeek: string
    startTime: string
    endTime: string
  }>
}

// POST /api/profiles - Crea profilo
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json() as ProfileInput

    const createInput: Prisma.ProfileCreateInput = {
      userId,
      organizationId: orgId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      level: body.level,
      preferredSport: body.preferredSport,
      notes: body.notes,
      availability: body.availability ? {
        create: body.availability.map(slot => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      } : undefined
    }

    const profile = await db.profile.create({
      data: createInput,
      include: {
        availability: true
      } as Prisma.ProfileInclude
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}