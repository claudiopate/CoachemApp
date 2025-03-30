"use client"

import { OrganizationSwitcher as ClerkOrganizationSwitcher } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export function OrganizationSwitcher() {
  const { theme } = useTheme()
  const router = useRouter()

  return (
    <ClerkOrganizationSwitcher
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements: {
          rootBox: {
            width: "100%",
            maxWidth: "300px",
          },
          organizationSwitcherTrigger: {
            padding: "8px 12px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            width: "100%",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "var(--accent)",
            },
          },
        },
      }}
      createOrganizationMode="modal"
      createOrganizationUrl="/dashboard/organizations"
      afterCreateOrganizationUrl="/dashboard"
      afterLeaveOrganizationUrl="/dashboard/organizations"
      afterSelectOrganizationUrl="/dashboard"
    />
  )
}

