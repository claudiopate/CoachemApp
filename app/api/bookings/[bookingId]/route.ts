import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/bookings/[bookingId] - Ottieni prenotazione
export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { orgId } = await getAuth()

    const booking = await db.booking.findUnique({
      where: {
        id: params.bookingId,
        organizationId: orgId
      },
      include: {
        user: true,
        coach: true,
        attendance: true
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH /api/bookings/[bookingId] - Aggiorna prenotazione
export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { orgId } = await getAuth()
    const values = await req.json()

    const booking = await db.booking.update({
      where: {
        id: params.bookingId,
        organizationId: orgId
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE /api/bookings/[bookingId] - Elimina prenotazione
export async function DELETE(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { orgId } = await getAuth()

    // Prima eliminiamo l'attendance associata
    await db.attendance.deleteMany({
      where: {
        bookingId: params.bookingId,
        organizationId: orgId
      }
    })

    const booking = await db.booking.delete({
      where: {
        id: params.bookingId,
        organizationId: orgId
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 