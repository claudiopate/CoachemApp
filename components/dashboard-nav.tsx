"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, Users, MessageSquare, Settings } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 p-4 border-r min-w-[220px] h-[calc(100vh-64px)]">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", pathname === item.href && "bg-muted")}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

