"use client"

import { useOrganization } from "@clerk/nextjs"
import { type ReactNode, useEffect, useState } from "react"

type RoleGuardProps = {
  allowedRoles: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { organization, membership } = useOrganization()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (membership) {
      setHasAccess(allowedRoles.includes(membership.role))
    }
  }, [membership, allowedRoles])

  if (hasAccess === null) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return fallback || <div>You don't have permission to access this content.</div>
  }

  return <>{children}</>
}

