import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/profiles/[profileId] - Ottieni profilo
export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { orgId } = await getAuth()

    const profile = await db.profile.findUnique({
      where: {
        id: params.profileId,
        organizationId: orgId
      },
      include: {
        bookings: true,
        coaching: true,
        progressRecords: true
      }
    })

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH /api/profiles/[profileId] - Aggiorna profilo
export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { orgId } = await getAuth()
    const values = await req.json()

    const profile = await db.profile.update({
      where: {
        id: params.profileId,
        organizationId: orgId
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE /api/profiles/[profileId] - Elimina profilo
export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { orgId } = await getAuth()

    await db.profile.delete({
      where: {
        id: params.profileId,
        organizationId: orgId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PROFILE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 