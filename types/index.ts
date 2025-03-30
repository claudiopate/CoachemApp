export interface Profile {
  id: string
  name: string
  email: string
  image?: string
  level?: string
  preferredSport?: string
  phone?: string
  notes?: string
  availability: Array<{
    id: string
    dayOfWeek: string
    startTime: string
    endTime: string
  }>
}
