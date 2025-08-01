import { isToday as dfIsToday, isTomorrow as dfIsTomorrow, isPast, format } from "date-fns"

export function toDate(iso: string): Date {
  return new Date(iso)
}

export function friendlyLabel(dateIso: string): string {
  const date = toDate(dateIso)
  if (dfIsToday(date)) return "Today"
  if (dfIsTomorrow(date)) return "Tomorrow"
  if (isPast(date)) return "Overdue"
  return format(date, "MMM d")
}

export function isOverdue(dateIso: string): boolean {
  const date = toDate(dateIso)
  return isPast(date)
}