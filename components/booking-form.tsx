"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function BookingForm() {
  const [date, setDate] = useState<Date>()

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="student">Student</Label>
          <Select>
            <SelectTrigger id="student">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emma">Emma Johnson</SelectItem>
              <SelectItem value="michael">Michael Chen</SelectItem>
              <SelectItem value="sophia">Sophia Rodriguez</SelectItem>
              <SelectItem value="james">James Wilson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Lesson Type</Label>
          <Select>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="padel">Padel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select>
            <SelectTrigger id="time" className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:00">9:00 AM</SelectItem>
              <SelectItem value="10:00">10:00 AM</SelectItem>
              <SelectItem value="11:00">11:00 AM</SelectItem>
              <SelectItem value="12:00">12:00 PM</SelectItem>
              <SelectItem value="13:00">1:00 PM</SelectItem>
              <SelectItem value="14:00">2:00 PM</SelectItem>
              <SelectItem value="15:00">3:00 PM</SelectItem>
              <SelectItem value="16:00">4:00 PM</SelectItem>
              <SelectItem value="17:00">5:00 PM</SelectItem>
              <SelectItem value="18:00">6:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select defaultValue="60">
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="court">Court</Label>
          <Select>
            <SelectTrigger id="court">
              <SelectValue placeholder="Select court" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="court1">Court 1</SelectItem>
              <SelectItem value="court2">Court 2</SelectItem>
              <SelectItem value="court3">Court 3</SelectItem>
              <SelectItem value="court4">Court 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          className="w-full min-h-[100px] p-2 rounded-md border"
          placeholder="Add any additional notes or instructions..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create Booking</Button>
      </div>
    </form>
  )
}

