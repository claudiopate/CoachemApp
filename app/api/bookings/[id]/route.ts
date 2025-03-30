import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = getAuth(request)

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.id,
        organizationId: orgId,
      },
    })

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = getAuth(request)

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { date, startTime, endTime, type, status } = body

    const booking = await prisma.booking.update({
      where: {
        id: params.id,
        organizationId: orgId,
      },
      data: {
        date,
        startTime,
        endTime,
        type,
        status,
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = getAuth(request)

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.booking.delete({
      where: {
        id: params.id,
        organizationId: orgId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[BOOKING_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 