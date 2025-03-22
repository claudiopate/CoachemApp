import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs"

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all bookings for this coach
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("user_id")
      .eq("coach_id", userId)
      .order("date", { ascending: false })

    if (bookingsError) throw bookingsError

    // Get unique student IDs
    const studentIds = [...new Set(bookings.map((booking) => booking.user_id))]

    if (studentIds.length === 0) {
      return NextResponse.json([])
    }

    // Get student profiles
    const { data: students, error: studentsError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", studentIds)

    if (studentsError) throw studentsError

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

