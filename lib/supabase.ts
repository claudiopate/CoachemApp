import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          level: string | null
          preferred_sport: string | null
          preferred_days: string[] | null
          preferred_times: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          level?: string | null
          preferred_sport?: string | null
          preferred_days?: string[] | null
          preferred_times?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          level?: string | null
          preferred_sport?: string | null
          preferred_days?: string[] | null
          preferred_times?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          date: string
          start_time: string
          end_time: string
          type: string
          court: string | null
          status: string
          notes: string | null
          user_id: string
          coach_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time: string
          end_time: string
          type: string
          court?: string | null
          status: string
          notes?: string | null
          user_id: string
          coach_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string
          end_time?: string
          type?: string
          court?: string | null
          status?: string
          notes?: string | null
          user_id?: string
          coach_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          booking_id: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_records: {
        Row: {
          id: string
          user_id: string
          skill: string
          level: number
          notes: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill: string
          level: number
          notes?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill?: string
          level?: number
          notes?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

