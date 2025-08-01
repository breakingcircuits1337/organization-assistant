"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, FileText, Plus, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIStatusIndicator } from "@/components/ai-status-indicator"
import { useAppStore } from "@/lib/store"
import { friendlyLabel, toDate, isOverdue } from "@/lib/date"
import type { Task } from "@/types/Task"
import type { Note } from "@/types/Note"

export default function Dashboard() {
  const tasks = useAppStore((state) => state.tasks)
  const notes = useAppStore((state) => state.notes)

  // Parse dates for tasks
  const parsedTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        dueDateObj: toDate(task.dueDate),
      })),
    [tasks]
  )

  // Parse dates for notes
  const parsedNotes = useMemo(
    () =>
      notes.map((note) => ({
        ...note,
        createdAtObj: toDate(note.createdAt),
      })),
    [notes]
  )

  const upcomingTasks = parsedTasks
    .filter((task) => !task.completed && !isOverdue(task.dueDate))
    .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime())
    .slice(0, 5)

  const overdueTasks = parsedTasks.filter((task) => !task.completed && isOverdue(task.dueDate))
  const completedTasks = parsedTasks.filter((task) => task.completed)
  const recentNotes = parsedNotes.slice(0, 3)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <AIStatusIndicator />
              <ThemeToggle />
              <Link href="/tasks" aria-label="Tasks">
                <Button>
                  <span className="sr-only">Create Task</span>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </Link>
              <Link href="/notes" aria-label="Notes">
                <Button variant="outline">
                  <span className="sr-only">Create Note</span>
                  <FileText className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
              Dashboard
            </Link>
            <Link href="/tasks" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Tasks
            </Link>
            <Link href="/calendar" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Calendar
            </Link>
            <Link href="/notes" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Notes
            </Link>
            <Link href="/search" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/voice" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Voice Assistant
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parsedTasks.length}</div>
              <p className="text-xs text-muted-foreground">{completedTasks.length} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parsedNotes.length}</div>
              <p className="text-xs text-muted-foreground">Ideas captured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {parsedTasks.length === 0
                  ? "0%"
                  : Math.round((completedTasks.length / parsedTasks.length) * 100) + "%"}
              </div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your next 5 tasks by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={isOverdue(task.dueDate) ? "destructive" : "secondary"}>
                        {friendlyLabel(task.dueDate)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {upcomingTasks.length === 0 && <p className="text-gray-500 text-center py-4">No upcoming tasks</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
              <CardDescription>Your latest captured ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">{note.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{format(note.createdAtObj, "MMM d")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/tasks">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </Link>
              <Link href="/notes">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Write Note
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Search className="w-4 h-4 mr-2" />
                  Search All
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
