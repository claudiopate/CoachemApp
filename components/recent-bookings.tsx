"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentBookings = [
  {
    id: "1",
    student: {
      name: "Emma Johnson",
      email: "emma@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-05-15",
    time: "10:00 AM",
    duration: "1 hour",
    type: "Tennis",
    status: "completed",
  },
  {
    id: "2",
    student: {
      name: "Michael Chen",
      email: "michael@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-05-16",
    time: "2:00 PM",
    duration: "1 hour",
    type: "Padel",
    status: "upcoming",
  },
  {
    id: "3",
    student: {
      name: "Sophia Rodriguez",
      email: "sophia@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-05-17",
    time: "4:00 PM",
    duration: "1.5 hours",
    type: "Tennis",
    status: "upcoming",
  },
  {
    id: "4",
    student: {
      name: "James Wilson",
      email: "james@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-05-14",
    time: "11:00 AM",
    duration: "1 hour",
    type: "Padel",
    status: "cancelled",
  },
]

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={booking.student.image} alt={booking.student.name} />
            <AvatarFallback>
              {booking.student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.student.name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.date} at {booking.time} ({booking.duration})
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">{booking.type}</Badge>
            <Badge
              variant={
                booking.status === "completed" ? "default" : booking.status === "upcoming" ? "secondary" : "destructive"
              }
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

