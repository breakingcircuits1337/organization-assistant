"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, Clock, Filter, Plus, Search, Trash2, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useVoiceCommandContext } from "@/context/voice-command-context"
import { useAppStore } from "@/lib/store"
import { friendlyLabel, toDate, isOverdue } from "@/lib/date"
import type { Task } from "@/types/Task"

const categories = ["Work", "Personal", "Health", "Learning", "Finance"]

export default function TasksPage() {
  const tasks = useAppStore((state) => state.tasks)
  const addTask = useAppStore((state) => state.addTask)
  const updateTask = useAppStore((state) => state.updateTask)
  const deleteTask = useAppStore((state) => state.deleteTask)
  const toggleTaskCompletion = useAppStore((state) => state.toggleTaskCompletion)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [isCategorizingTask, setIsCategorizingTask] = useState(false)

  const { pendingTask, setPendingTask, triggerDialog, setTriggerDialog } = useVoiceCommandContext()

  // Effect to handle pending task from voice command
  useEffect(() => {
    if (triggerDialog === "task" && pendingTask) {
      setNewTask({
        title: pendingTask.title || "",
        description: pendingTask.description || "",
        dueDate: pendingTask.dueDate || "",
        category: pendingTask.category || "",
        priority: pendingTask.priority || "medium",
      })
      const timer = setTimeout(() => {
        setIsDialogOpen(true)
      }, 0)
      setPendingTask(null)
      setTriggerDialog(null)
      return () => clearTimeout(timer)
    }
  }, [pendingTask, triggerDialog, setPendingTask, setTriggerDialog])

  // Filtering and search
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((task) => task.category === filterCategory)
    }

    if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    } else if (filterStatus === "overdue") {
      filtered = filtered.filter((task) => !task.completed && isOverdue(task.dueDate))
    }

    return filtered
  }, [tasks, searchTerm, filterCategory, filterStatus])

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.dueDate) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date(newTask.dueDate).toISOString(),
      category: newTask.category,
      completed: false,
      priority: newTask.priority,
    }

    addTask(task)
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      category: "",
      priority: "medium",
    })
    setIsDialogOpen(false)
  }

  const handleToggleTaskCompletion = (taskId: string) => {
    toggleTaskCompletion(taskId)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
  }

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

  const handleAICategorization = async () => {
    if (!newTask.title) return

    setIsCategorizingTask(true)
    try {
      const response = await fetch("/api/ai/categorize-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
        }),
      })

      if (response.ok) {
        const { category } = await response.json()
        setNewTask({ ...newTask, category })
      }
    } catch (error) {
      console.error("Failed to categorize task:", error)
    } finally {
      setIsCategorizingTask(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">Manage your tasks and stay organized</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="create-task-button">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a new task to your list. Fill in the details below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">Category</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAICategorization}
                          disabled={!newTask.title || isCategorizingTask}
                          className="text-xs"
                        >
                          {isCategorizingTask ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1" />
                          )}
                          AI Suggest
                        </Button>
                      </div>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewTask({ ...newTask, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateTask}>
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="py-4 px-1 text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/tasks" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const dueDate = toDate(task.dueDate)
            return (
              <Card key={task.id} className={`${task.completed ? "opacity-60" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge variant="outline">{task.category}</Badge>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Badge variant={isOverdue(task.dueDate) && !task.completed ? "destructive" : "secondary"}>
                            <Clock className="w-3 h-3 mr-1" />
                            {friendlyLabel(task.dueDate)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filteredTasks.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "Create your first task to get started"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
