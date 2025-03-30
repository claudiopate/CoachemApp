"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Home,
  Menu,
  TurtleIcon as TennisBall,
  LogOut,
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setOpen(false)}>
            <TennisBall className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-heading">CourtTime</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col gap-1 p-3">
            <Link href="/" className="sidebar-item" onClick={() => setOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <div className="my-2 px-3">
              <p className="text-xs font-medium text-muted-foreground">MENU</p>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("sidebar-item", pathname === item.href && "active")}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setOpen(false)
              signOut(() => (window.location.href = "/"))
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

