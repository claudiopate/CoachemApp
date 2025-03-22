"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { ScheduleView } from "@/components/schedule-view"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule and bookings</p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="new-booking">New Booking</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose a date to view or manage bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {date
                    ? date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </CardTitle>
                <CardDescription>Your schedule for the selected date</CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleView date={date} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="new-booking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Booking</CardTitle>
              <CardDescription>Schedule a new lesson or session</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

