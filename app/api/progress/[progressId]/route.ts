import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuth } from "@/lib/auth"

// GET /api/progress/[progressId] - Ottieni progresso
export async function GET(req: Request, props: { params: Promise<{ progressId: string }> }) {
  const params = await props.params;
  try {
    const { orgId } = getAuth()

    const progress = await db.progressRecord.findUnique({
      where: {
        id: params.progressId,
        organizationId: orgId
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH /api/progress/[progressId] - Aggiorna progresso
export async function PATCH(req: Request, props: { params: Promise<{ progressId: string }> }) {
  const params = await props.params;
  try {
    const { orgId } = getAuth()
    const values = await req.json()

    const progress = await db.progressRecord.update({
      where: {
        id: params.progressId,
        organizationId: orgId
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE /api/progress/[progressId] - Elimina progresso
export async function DELETE(req: Request, props: { params: Promise<{ progressId: string }> }) {
  const params = await props.params;
  try {
    const { orgId } = getAuth()

    const progress = await db.progressRecord.delete({
      where: {
        id: params.progressId,
        organizationId: orgId
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 