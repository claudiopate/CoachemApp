"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type StudentListProps = {
  searchQuery: string
  onSelectStudent: (id: string) => void
  selectedStudent: string | null
}

// Mock data for students
const students = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma@example.com",
    image: "/placeholder.svg?height=32&width=32",
    level: "Intermediate",
    type: "Tennis",
    status: "active",
    lastLesson: "2023-05-12",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    image: "/placeholder.svg?height=32&width=32",
    level: "Beginner",
    type: "Padel",
    status: "active",
    lastLesson: "2023-05-14",
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "sophia@example.com",
    image: "/placeholder.svg?height=32&width=32",
    level: "Advanced",
    type: "Tennis",
    status: "active",
    lastLesson: "2023-05-10",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@example.com",
    image: "/placeholder.svg?height=32&width=32",
    level: "Intermediate",
    type: "Padel",
    status: "inactive",
    lastLesson: "2023-04-28",
  },
  {
    id: "5",
    name: "Olivia Brown",
    email: "olivia@example.com",
    image: "/placeholder.svg?height=32&width=32",
    level: "Beginner",
    type: "Tennis",
    status: "active",
    lastLesson: "2023-05-15",
  },
]

export function StudentList({ searchQuery, onSelectStudent, selectedStudent }: StudentListProps) {
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-2">
      {filteredStudents.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No students found</p>
      ) : (
        filteredStudents.map((student) => (
          <div
            key={student.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedStudent === student.id ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => onSelectStudent(student.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={student.image} alt={student.name} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{student.name}</p>
                <p className="text-sm text-muted-foreground truncate">{student.email}</p>
              </div>
              <Badge variant={student.status === "active" ? "default" : "secondary"} className="ml-auto">
                {student.status}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

