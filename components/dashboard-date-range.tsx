"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { CalendarDateRangePicker } from "@/components/date-range-picker"

export function DashboardDateRange() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })

  return <CalendarDateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
}

