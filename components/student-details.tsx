"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, Phone } from "lucide-react"

type StudentDetailsProps = {
  studentId: string
}

// Mock data for student details
const studentsData = {
  "1": {
    id: "1",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "+1 (555) 123-4567",
    image: "/placeholder.svg?height=64&width=64",
    level: "Intermediate",
    preferredSport: "Tennis",
    status: "active",
    joinDate: "2023-01-15",
    preferredDays: ["Monday", "Wednesday", "Saturday"],
    preferredTimes: "Evenings and weekends",
    notes: "Working on improving backhand technique. Prefers female coaches.",
    attendance: [
      { date: "2023-05-12", status: "attended", notes: "Worked on serve technique" },
      { date: "2023-05-05", status: "attended", notes: "Focused on footwork" },
      { date: "2023-04-28", status: "missed", notes: "Cancelled due to illness" },
      { date: "2023-04-21", status: "attended", notes: "Match practice" },
    ],
    progress: [
      { skill: "Forehand", level: 7 },
      { skill: "Backhand", level: 5 },
      { skill: "Serve", level: 6 },
      { skill: "Volley", level: 4 },
      { skill: "Footwork", level: 6 },
    ],
  },
  "2": {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 (555) 987-6543",
    image: "/placeholder.svg?height=64&width=64",
    level: "Beginner",
    preferredSport: "Padel",
    status: "active",
    joinDate: "2023-02-10",
    preferredDays: ["Tuesday", "Thursday", "Sunday"],
    preferredTimes: "Mornings",
    notes: "New to padel, transitioning from tennis. Very enthusiastic learner.",
    attendance: [
      { date: "2023-05-14", status: "attended", notes: "Basic padel rules and grip" },
      { date: "2023-05-07", status: "attended", notes: "Wall play practice" },
      { date: "2023-04-30", status: "attended", notes: "Basic strokes" },
    ],
    progress: [
      { skill: "Forehand", level: 3 },
      { skill: "Backhand", level: 2 },
      { skill: "Serve", level: 2 },
      { skill: "Wall play", level: 4 },
      { skill: "Positioning", level: 3 },
    ],
  },
  // Additional student data would be here
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const student = studentsData[studentId as keyof typeof studentsData]

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.image} alt={student.name} />
            <AvatarFallback className="text-2xl">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <Button size="sm" variant="outline" className="gap-1">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{student.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{student.preferredSport}</Badge>
              <Badge variant="outline">{student.level}</Badge>
              <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Student's preferences and availability</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Preferred Days</h3>
              <div className="flex flex-wrap gap-1">
                {student.preferredDays.map((day) => (
                  <Badge key={day} variant="outline">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Preferred Times</h3>
              <p>{student.preferredTimes}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{student.notes}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendance" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Record of past lessons and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.attendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{record.date}</p>
                    <p className="text-sm text-muted-foreground">{record.notes}</p>
                  </div>
                  <Badge variant={record.status === "attended" ? "default" : "destructive"}>{record.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Skill Progress</CardTitle>
            <CardDescription>Student's progress in different skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.progress.map((skill) => (
                <div key={skill.skill} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{skill.skill}</p>
                    <span className="text-sm">{skill.level}/10</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${skill.level * 10}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

