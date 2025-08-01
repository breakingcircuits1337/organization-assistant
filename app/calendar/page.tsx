"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar as RBCalendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Link from "next/link"
import { friendlyLabel, toDate } from "@/lib/date"
import enUS from "date-fns/locale/en-US"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

export default function CalendarPage() {
  const tasks = useAppStore((s) => s.tasks)
  const hydrate = useAppStore((s) => s.hydrate)
  const router = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const events =
    tasks.map((t) => ({
      title: t.title,
      start: toDate(t.dueDate),
      end: toDate(t.dueDate),
      resource: t.id,
    })) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 mr-2" />
              <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/tasks" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Tasks
              </Link>
              <Link href="/calendar" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
                Calendar
              </Link>
              <Link href="/notes" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Notes
              </Link>
              <Link href="/search" className="py-4 px-1 text-muted-foreground hover:text-foreground">
                Search
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <RBCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            onSelectEvent={(event) => router.push("/tasks")}
          />
        </div>
      </main>
    </div>
  )
}