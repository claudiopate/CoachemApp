import { auth, clerkClient } from "@clerk/nextjs"

export async function getUserRole() {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return null
  }

  try {
    const membership = await clerkClient.organizations.getOrganizationMembership({
      organizationId: orgId,
      userId,
    })

    return membership.role
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

export async function isStudent() {
  const role = await getUserRole()
  return role === "student"
}

