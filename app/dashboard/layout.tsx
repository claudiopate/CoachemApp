import type React from "react"
import { UserNav } from "@/components/user-nav"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { OrganizationSwitcher } from "@/components/organization-switcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header mobile */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <MobileSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-primary">CourtTime</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <Sidebar className="hidden lg:block" />

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="flex h-16 items-center gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px]">
            <div className="flex-1">
              <OrganizationSwitcher />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
          <div className="container py-6 md:py-8 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  )
}

