"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  name: string
  email: string
  image: string | null
  level: string
  preferredSport: string
  status: string
  bookings: {
    date: string
  }[]
}

interface StudentListProps {
  searchQuery: string
  onSelectStudent: (studentId: string) => void
  selectedStudent: string | null
}

export function StudentList({ searchQuery, onSelectStudent, selectedStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students")
        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }
        const data = await response.json()
        setStudents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-2 rounded-lg animate-pulse">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        {error}
      </div>
    )
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Nessuno studente trovato
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredStudents.map((student) => (
        <button
          key={student.id}
          onClick={() => onSelectStudent(student.id)}
          className={cn(
            "w-full flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors",
            selectedStudent === student.id && "bg-muted"
          )}
        >
          <Avatar>
            <AvatarImage src={student.image || undefined} alt={student.name} />
            <AvatarFallback>{student.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={student.status === "active" ? "default" : "secondary"}>
              {student.status === "active" ? "Attivo" : "Inattivo"}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {student.bookings[0] ? new Date(student.bookings[0].date).toLocaleDateString() : "Nessuna lezione"}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

