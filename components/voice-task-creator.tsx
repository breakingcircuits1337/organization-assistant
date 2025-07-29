"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceInput } from "./voice-input"
import { Mic, Sparkles, Loader2 } from "lucide-react"

interface VoiceTaskCreatorProps {
  onTaskCreate: (task: {
    title: string
    description: string
    dueDate: string
    category: string
    priority: "low" | "medium" | "high"
  }) => void
  categories: string[]
}

export function VoiceTaskCreator({ onTaskCreate, categories }: VoiceTaskCreatorProps) {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  const handleVoiceTranscriptMemo = useCallback((transcript: string) => {
    if (transcript) {
      setTask((prev) => ({ ...prev, title: transcript }))
    }
  }, [])

  const handleFinalTranscriptMemo = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    try {
      // Use AI to parse the voice input into structured task data
      const response = await fetch("/api/ai/parse-voice-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })

      if (response.ok) {
        const parsedTask = await response.json()
        setTask((prev) => ({
          ...prev,
          ...parsedTask,
        }))
      } else {
        // Fallback: use transcript as title
        setTask((prev) => ({ ...prev, title: transcript }))
      }
    } catch (error) {
      console.error("Failed to parse voice input:", error)
      // Fallback: use transcript as title
      setTask((prev) => ({ ...prev, title: transcript }))
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleSubmit = () => {
    if (task.title && task.dueDate) {
      onTaskCreate(task)
      setTask({
        title: "",
        description: "",
        dueDate: "",
        category: "",
        priority: "medium",
      })
      setIsVoiceMode(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Task Creator
            </CardTitle>
            <CardDescription>Create tasks using voice commands or traditional input</CardDescription>
          </div>
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            {isVoiceMode ? "Switch to Manual" : "Use Voice"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVoiceMode && (
          <VoiceInput
            onTranscriptChange={handleVoiceTranscriptMemo}
            onFinalTranscript={handleFinalTranscriptMemo}
            placeholder="Say something like: 'Create a task to finish the project proposal by Friday with high priority in the work category'"
          />
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing voice input with AI...
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={task.category} onValueChange={(value) => setTask({ ...task, category: value })}>
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

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(value: "low" | "medium" | "high") => setTask({ ...task, priority: value })}
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

          <Button onClick={handleSubmit} disabled={!task.title || !task.dueDate} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
