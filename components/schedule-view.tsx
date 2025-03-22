"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

type ScheduleViewProps = {
  date?: Date
}

// Mock data for schedule
const timeSlots = [
  {
    id: "1",
    time: "9:00 AM - 10:00 AM",
    student: "Emma Johnson",
    type: "Tennis",
    level: "Intermediate",
    court: "Court 1",
    status: "confirmed",
  },
  {
    id: "2",
    time: "10:30 AM - 11:30 AM",
    student: "Michael Chen",
    type: "Padel",
    level: "Beginner",
    court: "Court 2",
    status: "confirmed",
  },
  {
    id: "3",
    time: "1:00 PM - 2:30 PM",
    student: "Sophia Rodriguez",
    type: "Tennis",
    level: "Advanced",
    court: "Court 1",
    status: "confirmed",
  },
  {
    id: "4",
    time: "3:00 PM - 4:00 PM",
    student: null,
    type: null,
    level: null,
    court: "Court 3",
    status: "available",
  },
  {
    id: "5",
    time: "4:30 PM - 5:30 PM",
    student: "James Wilson",
    type: "Padel",
    level: "Intermediate",
    court: "Court 2",
    status: "pending",
  },
]

export function ScheduleView({ date }: ScheduleViewProps) {
  if (!date) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select a date to view your schedule</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {timeSlots.map((slot) => (
        <div
          key={slot.id}
          className={`p-4 rounded-lg border ${
            slot.status === "available" ? "border-dashed border-muted-foreground/50" : "border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{slot.time}</div>
            <div className="flex items-center gap-2">
              {slot.status === "available" ? (
                <Button size="sm" variant="outline">
                  Book Slot
                </Button>
              ) : (
                <>
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {slot.student ? (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="text-muted-foreground">Student:</div>
              <div>{slot.student}</div>

              <div className="text-muted-foreground">Type:</div>
              <div>{slot.type}</div>

              <div className="text-muted-foreground">Level:</div>
              <div>{slot.level}</div>

              <div className="text-muted-foreground">Court:</div>
              <div>{slot.court}</div>

              <div className="text-muted-foreground">Status:</div>
              <div>
                <Badge
                  variant={
                    slot.status === "confirmed" ? "default" : slot.status === "pending" ? "secondary" : "outline"
                  }
                >
                  {slot.status}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">Available slot - {slot.court}</div>
          )}
        </div>
      ))}
    </div>
  )
}

