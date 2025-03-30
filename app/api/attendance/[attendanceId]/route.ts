import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/attendance/[attendanceId] - Ottieni presenza
export async function GET(
  req: Request,
  { params }: { params: { attendanceId: string } }
) {
  try {
    const { orgId } = getAuth()

    const attendance = await db.attendance.findUnique({
      where: {
        id: params.attendanceId,
        organizationId: orgId
      },
      include: {
        booking: {
          include: {
            user: true,
            coach: true
          }
        }
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[ATTENDANCE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH /api/attendance/[attendanceId] - Aggiorna presenza
export async function PATCH(
  req: Request,
  { params }: { params: { attendanceId: string } }
) {
  try {
    const { orgId } = getAuth()
    const values = await req.json()

    const attendance = await db.attendance.update({
      where: {
        id: params.attendanceId,
        organizationId: orgId
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[ATTENDANCE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE /api/attendance/[attendanceId] - Elimina presenza
export async function DELETE(
  req: Request,
  { params }: { params: { attendanceId: string } }
) {
  try {
    const { orgId } = getAuth()

    const attendance = await db.attendance.delete({
      where: {
        id: params.attendanceId,
        organizationId: orgId
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[ATTENDANCE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 