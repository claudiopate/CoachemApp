"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { it } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CustomCalendarProps {
  className?: string
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  numberOfMonths?: number
}

export function CustomCalendar({ className, selectedDate, onDateChange, numberOfMonths = 1 }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const renderHeader = (date: Date) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{format(date, "MMMM yyyy", { locale: it })}</h2>
      </div>
    )
  }

  const renderDays = () => {
    const days = ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"]
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = (date: Date) => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-10 w-10 p-0 font-normal flex items-center justify-center rounded-full",
              !isSameMonth(day, monthStart) && "text-muted-foreground opacity-50",
              isSameDay(day, selectedDate || new Date()) && "bg-primary text-primary-foreground",
              isToday(day) && !isSameDay(day, selectedDate || new Date()) && "bg-accent text-accent-foreground",
              "hover:bg-accent hover:text-accent-foreground cursor-pointer",
            )}
            onClick={() => onDateChange && onDateChange(cloneDay)}
          >
            {format(day, "d")}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>,
      )
      days = []
    }

    return <div className="mt-2">{rows}</div>
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1))
  }

  const renderMonths = () => {
    const months = []
    for (let i = 0; i < numberOfMonths; i++) {
      const monthDate = addMonths(currentDate, i)
      months.push(
        <div key={i} className="p-4 border rounded-lg">
          {renderHeader(monthDate)}
          {renderDays()}
          {renderCells(monthDate)}
        </div>,
      )
    }
    return months
  }

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-7 w-7 bg-transparent p-0">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Mese precedente</span>
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-7 w-7 bg-transparent p-0">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Mese successivo</span>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">{renderMonths()}</div>
    </div>
  )
}

