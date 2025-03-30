import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/attendance - Lista presenze
export async function GET(req: Request) {
  try {
    const { orgId } = getAuth()
    const { searchParams } = new URL(req.url)
    
    const bookingId = searchParams.get("bookingId")
    const status = searchParams.get("status")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where = {
      organizationId: orgId,
      ...(bookingId && { bookingId }),
      ...(status && { status }),
      ...(from && to && {
        booking: {
          date: {
            gte: new Date(from),
            lte: new Date(to)
          }
        }
      })
    }

    const attendance = await db.attendance.findMany({
      where,
      include: {
        booking: {
          include: {
            user: true,
            coach: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[ATTENDANCE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST /api/attendance - Crea presenza
export async function POST(req: Request) {
  try {
    const { orgId } = getAuth()
    const { bookingId, status, notes } = await req.json()

    const attendance = await db.attendance.create({
      data: {
        bookingId,
        status,
        notes,
        organizationId: orgId
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[ATTENDANCE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 