"use client"
import { useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { toDate } from "@/lib/date"

function hoursDiff(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60)
}

export function ReminderManager() {
  const tasks = useAppStore((s) => s.tasks)
  const hydrate = useAppStore((s) => s.hydrate)
  const notified = useRef<Set<string>>(new Set())

  useEffect(() => { hydrate() }, [hydrate])

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    Notification.requestPermission()

    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return
      const now = new Date()
      tasks.forEach((task) => {
        if (task.completed) return
        const date = toDate(task.dueDate)
        const diff = hoursDiff(now, date)
        if (diff >= 0 && diff <= 24 && !notified.current.has(task.id)) {
          new Notification("Task Reminder", {
            body: `${task.title} is due ${date.toLocaleString()}`,
          })
          notified.current.add(task.id)
        }
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [tasks])

  return null
}