import { auth } from "@clerk/nextjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getUserRole() {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return null
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
        organizationId: orgId,
      },
    })

    return profile ? "coach" : "student"
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

export async function isCoach() {
  const role = await getUserRole()
  return role === "coach"
}

export async function isStudent() {
  const role = await getUserRole()
  return role === "student"
} 