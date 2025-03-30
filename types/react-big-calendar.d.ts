declare module 'react-big-calendar' {
  import { ComponentType } from 'react'
  import { Locale } from 'date-fns'

  export interface DateLocalizer {
    format: (value: Date, format: string, culture?: string) => string
    formats: Record<string, string>
    propType?: unknown
  }

  export interface Event {
    id: string
    title: string
    start: Date
    end: Date
    resource?: any
  }

  export interface CalendarProps<TEvent = Event> {
    localizer: DateLocalizer
    events: TEvent[]
    startAccessor: string | ((event: TEvent) => Date)
    endAccessor: string | ((event: TEvent) => Date)
    defaultView?: string
    views?: string[]
    culture?: string
    messages?: Record<string, string | ((total: number) => string)>
    min?: Date
    max?: Date
    eventPropGetter?: (event: TEvent) => { className?: string; style?: React.CSSProperties }
    components?: {
      event?: ComponentType<{ event: TEvent }>
    }
  }

  export function dateFnsLocalizer(args: {
    format: (date: Date, format: string, options?: { locale?: Locale }) => string
    parse: (str: string, format: string, fallback: Date) => Date
    startOfWeek: (date: Date) => Date
    getDay: (date: Date) => number
    locales: { [key: string]: Locale }
  }): DateLocalizer

  export const Calendar: <TEvent extends Event = Event>(
    props: CalendarProps<TEvent>
  ) => JSX.Element

  export type View = 'month' | 'week' | 'day' | 'agenda'
} 