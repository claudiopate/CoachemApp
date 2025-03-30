"use client"

import { useState } from "react"
import { CustomCalendar } from "@/components/custom-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendario Prenotazioni</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} numberOfMonths={2} />
      </CardContent>
    </Card>
  )
}

