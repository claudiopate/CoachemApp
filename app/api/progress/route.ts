import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/progress - Lista progressi
export async function GET(req: Request) {
  try {
    const { orgId } = getAuth()
    const { searchParams } = new URL(req.url)
    
    const profileId = searchParams.get("profileId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where = {
      organizationId: orgId,
      ...(profileId && { profileId }),
      ...(from && to && {
        date: {
          gte: new Date(from),
          lte: new Date(to)
        }
      })
    }

    const progress = await db.progressRecord.findMany({
      where,
      include: {
        profile: true
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST /api/progress - Crea progresso
export async function POST(req: Request) {
  try {
    const { orgId } = getAuth()
    const { profileId, date, notes } = await req.json()

    const progress = await db.progressRecord.create({
      data: {
        profileId,
        date: new Date(date),
        notes,
        organizationId: orgId
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 