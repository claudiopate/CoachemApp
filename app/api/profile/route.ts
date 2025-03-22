import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs"

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error

    return NextResponse.json(data || {})
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()

      if (error) throw error

      return NextResponse.json(data[0])
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      return NextResponse.json(data[0], { status: 201 })
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

