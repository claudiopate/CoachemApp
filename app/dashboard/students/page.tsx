"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentList } from "@/components/student-list"
import { StudentDetails } from "@/components/student-details"
import { PlusCircle, Search } from "lucide-react"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your students and their progress</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>Select a student to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentList
                  searchQuery={searchQuery}
                  onSelectStudent={setSelectedStudent}
                  selectedStudent={selectedStudent}
                />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
                <CardDescription>View and manage student information</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <StudentDetails studentId={selectedStudent} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">Select a student from the list to view their details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          {/* Similar structure as "all" tab but filtered for active students */}
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          {/* Similar structure as "all" tab but filtered for inactive students */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

