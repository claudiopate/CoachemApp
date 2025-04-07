import { auth, clerkClient } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function getUserRole() {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return null
  }

  try {
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    })

    const membership = memberships.find(m => m.publicUserData?.userId === userId)
    return membership?.role || null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

export async function isCoach() {
  const role = await getUserRole()
  return role === "admin" || role === "coach"
}

export async function isAdmin() {
  const role = await getUserRole()
  return role === "admin"
}

export async function isProfileUser() {
  const role = await getUserRole()
  return role === "basic_member"
}

export async function getCurrentProfile() {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return null
  }

  try {
    const profile = await db.profile.findFirst({
      where: {
        userId,
        organizationId: orgId,
      }
    })

    return profile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

export async function requireProfile() {
  const profile = await getCurrentProfile()

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export async function getAuth() {
  try {
    const session = auth()
    const { userId, orgId } = session

    if (!userId || !orgId) {
      throw new Error("Unauthorized")
    }

    return { userId, orgId }
  } catch (error) {
    console.error("[AUTH_ERROR]", error)
    throw new Error("Unauthorized")
  }
}
