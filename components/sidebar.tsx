"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Home,
  TurtleIcon as TennisBall,
  LogOut,
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

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
      title: "Profiles",
      href: "/dashboard/profiles",
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

  return (
    <div className={cn("flex flex-col border-r bg-background", className)}>
      <div className="flex h-[60px] items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <TennisBall className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-heading">CourtTime</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <div className="flex flex-col gap-1 px-3">
          <Link href="/" className="sidebar-item">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <div className="my-2 px-3">
            <p className="text-xs font-medium text-muted-foreground">MENU</p>
          </div>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("sidebar-item", pathname === item.href && "active")}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut().then(() => window.location.href = "/")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
