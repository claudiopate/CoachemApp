import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

// GET /api/profiles - Ottieni tutti i profili dell'organizzazione
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const { orgId } = getAuth(request)

    if (!orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const profiles = await prisma.profile.findMany({
      where: {
        organizationId: orgId,
        OR: [
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            level: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            preferredSport: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("[PROFILES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/profiles - Crea un nuovo profilo
export async function POST(request: NextRequest) {
  try {
    const { orgId } = getAuth(request)
    
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, phone, level, preferredSport, preferredDays, preferredTimes, notes } = body

    const profile = await prisma.profile.create({
      data: {
        userId,
        phone,
        level,
        preferredSport,
        preferredDays,
        preferredTimes,
        notes,
        organizationId: orgId,
      }
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("[PROFILE_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 