"use client"

import { OrganizationSwitcher as ClerkOrganizationSwitcher } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function OrganizationSwitcher() {
  const { theme } = useTheme()

  return (
    <ClerkOrganizationSwitcher
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements: {
          rootBox: {
            width: "100%",
          },
          organizationSwitcherTrigger: {
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            width: "100%",
            justifyContent: "space-between",
          },
        },
      }}
    />
  )
}

