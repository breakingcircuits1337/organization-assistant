"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Mic,
  Volume2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  BookOpen,
  Lightbulb,
  Settings,
} from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface VoiceCommand {
  command: string
  description: string
  example: string
  category: "task" | "note" | "search" | "navigation"
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface VoiceTip {
  title: string
  description: string
  type: "success" | "warning" | "info"
  icon: React.ReactNode
}

export function VoiceGuide() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const { speak, isSpeaking } = useTextToSpeech()

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const voiceCommands: VoiceCommand[] = [
    // Task Commands
    {
      command: "Create a task",
      description: "Creates a new task with basic information",
      example: "Create a task to finish the project proposal",
      category: "task",
      difficulty: "beginner",
    },
    {
      command: "Create a [priority] priority task",
      description: "Creates a task with specified priority level",
      example: "Create a high priority task to review quarterly reports",
      category: "task",
      difficulty: "beginner",
    },
    {
      command: "Add a [category] task",
      description: "Creates a task in a specific category",
      example: "Add a work task to prepare meeting agenda",
      category: "task",
      difficulty: "beginner",
    },
    {
      command: "Schedule a task for [date]",
      description: "Creates a task with a specific due date",
      example: "Schedule a task to call the dentist for tomorrow",
      category: "task",
      difficulty: "intermediate",
    },
    {
      command: "Create a [category] task to [action] by [date] with [priority] priority",
      description: "Creates a fully specified task with all details",
      example: "Create a work task to finish the presentation by Friday with high priority",
      category: "task",
      difficulty: "advanced",
    },

    // Note Commands
    {
      command: "Take a note",
      description: "Starts note-taking mode for voice dictation",
      example: "Take a note about today's meeting",
      category: "note",
      difficulty: "beginner",
    },
    {
      command: "Create a note about [topic]",
      description: "Creates a note with a specific topic",
      example: "Create a note about book recommendations",
      category: "note",
      difficulty: "beginner",
    },
    {
      command: "Add a [tag] note",
      description: "Creates a note with specific tags",
      example: "Add a meeting note about project updates",
      category: "note",
      difficulty: "intermediate",
    },

    // Search Commands
    {
      command: "Find [item]",
      description: "Searches for specific items across tasks and notes",
      example: "Find all high priority tasks",
      category: "search",
      difficulty: "beginner",
    },
    {
      command: "Search for [keyword]",
      description: "Performs a keyword search",
      example: "Search for project proposal",
      category: "search",
      difficulty: "beginner",
    },
    {
      command: "Show me [category] [type]",
      description: "Displays items from specific categories",
      example: "Show me work tasks",
      category: "search",
      difficulty: "intermediate",
    },
    {
      command: "Find [status] tasks",
      description: "Searches for tasks by completion status",
      example: "Find overdue tasks",
      category: "search",
      difficulty: "intermediate",
    },

    // Navigation Commands
    {
      command: "Go to [page]",
      description: "Navigates to different sections of the app",
      example: "Go to calendar",
      category: "navigation",
      difficulty: "beginner",
    },
    {
      command: "Open [section]",
      description: "Opens specific app sections",
      example: "Open voice assistant",
      category: "navigation",
      difficulty: "beginner",
    },
  ]

  const voiceTips: VoiceTip[] = [
    {
      title: "Speak Clearly and Naturally",
      description:
        "Use your normal speaking voice and pace. The system works best with clear, natural speech patterns.",
      type: "success",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      title: "Use Specific Keywords",
      description:
        "Include specific keywords like 'high priority', 'work category', or 'due tomorrow' for better recognition.",
      type: "info",
      icon: <Info className="w-4 h-4" />,
    },
    {
      title: "Avoid Background Noise",
      description:
        "Find a quiet environment for best voice recognition accuracy. Background noise can interfere with speech detection.",
      type: "warning",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      title: "Wait for the Listening Indicator",
      description:
        "Make sure you see the 'Listening...' indicator before speaking to ensure your voice is being captured.",
      type: "info",
      icon: <Mic className="w-4 h-4" />,
    },
    {
      title: "Use Natural Date References",
      description: "You can say 'tomorrow', 'next week', 'Friday', or specific dates like 'December 15th'.",
      type: "success",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      title: "Pause Between Commands",
      description: "Allow a brief pause between different voice commands to ensure each one is processed correctly.",
      type: "warning",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ]

  const categories = [
    { id: "task", name: "Task Management", icon: "📋", color: "bg-blue-100 text-blue-800" },
    { id: "note", name: "Note Taking", icon: "📝", color: "bg-green-100 text-green-800" },
    { id: "search", name: "Search & Find", icon: "🔍", color: "bg-purple-100 text-purple-800" },
    { id: "navigation", name: "Navigation", icon: "🧭", color: "bg-orange-100 text-orange-800" },
  ]

  const difficulties = [
    { id: "beginner", name: "Beginner", color: "bg-green-100 text-green-800" },
    { id: "intermediate", name: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { id: "advanced", name: "Advanced", color: "bg-red-100 text-red-800" },
  ]

  const speakExample = (text: string) => {
    speak(`Example: ${text}`)
  }

  const speakTip = (tip: VoiceTip) => {
    speak(`${tip.title}. ${tip.description}`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6" />
            Voice Commands Guide
          </CardTitle>
          <CardDescription>
            Learn how to use voice commands effectively with your organizational assistant. Master these commands to
            boost your productivity and work hands-free.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="commands" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commands">Voice Commands</TabsTrigger>
          <TabsTrigger value="tips">Usage Tips</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        {/* Voice Commands Tab */}
        <TabsContent value="commands" className="space-y-6">
          <div className="grid gap-6">
            {categories.map((category) => {
              const categoryCommands = voiceCommands.filter((cmd) => cmd.category === category.id)
              const sectionId = `section-${category.id}`
              const isOpen = openSections.includes(sectionId)

              return (
                <Card key={category.id}>
                  <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionId)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <CardDescription>{categoryCommands.length} commands available</CardDescription>
                            </div>
                          </div>
                          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {categoryCommands.map((command, index) => {
                            const difficulty = difficulties.find((d) => d.id === command.difficulty)
                            return (
                              <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                        {command.command}
                                      </code>
                                      <Badge className={difficulty?.color}>{difficulty?.name}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{command.description}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium">Example:</span>
                                      <span className="text-xs italic">"{command.example}"</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => speakExample(command.example)}
                                        disabled={isSpeaking}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Play className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Usage Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-4">
            {voiceTips.map((tip, index) => (
              <Alert
                key={index}
                className={
                  tip.type === "success"
                    ? "border-green-200 bg-green-50"
                    : tip.type === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                }
              >
                <div className="flex items-start gap-3">
                  {tip.icon}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <AlertDescription>{tip.description}</AlertDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakTip(tip)}
                    disabled={isSpeaking}
                    className="h-8 w-8 p-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </Alert>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Pro Tips for Better Voice Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">🎯 Be Specific</h4>
                  <p className="text-sm text-muted-foreground">
                    Instead of "Create a task", say "Create a high priority work task to finish the report by Friday"
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">📅 Use Natural Dates</h4>
                  <p className="text-sm text-muted-foreground">
                    Say "tomorrow", "next Monday", "in two weeks", or "December 15th" instead of exact dates
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">🏷️ Include Categories</h4>
                  <p className="text-sm text-muted-foreground">
                    Mention categories like "work", "personal", "health", "learning", or "finance" for better
                    organization
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">⚡ Use Priority Keywords</h4>
                  <p className="text-sm text-muted-foreground">
                    Include "high priority", "medium priority", or "low priority" to set task importance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-World Voice Command Examples</CardTitle>
                <CardDescription>
                  Here are practical examples of how to use voice commands in different scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">💼 Work Scenarios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Morning Planning:</strong>
                        <br />
                        "Create a high priority work task to review client proposals by 2 PM today"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Meeting Preparation:</strong>
                        <br />
                        "Add a work task to prepare quarterly presentation by Thursday"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Follow-up Tasks:</strong>
                        <br />
                        "Create a medium priority task to follow up with marketing team tomorrow"
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">🏠 Personal Life</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Household Tasks:</strong>
                        <br />
                        "Add a personal task to buy groceries this weekend"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Health Appointments:</strong>
                        <br />
                        "Create a health task to schedule dentist appointment by next week"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Social Events:</strong>
                        <br />
                        "Schedule a personal task to plan birthday party for next month"
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">📚 Learning & Development</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Study Goals:</strong>
                        <br />
                        "Create a learning task to complete React course by end of month"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Reading Plans:</strong>
                        <br />
                        "Add a low priority learning task to read chapter 5 this week"
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">🔍 Search Examples</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Finding Overdue Items:</strong>
                        <br />
                        "Find all overdue tasks" or "Show me overdue work tasks"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Category Search:</strong>
                        <br />
                        "Find all high priority health tasks" or "Show me personal notes"
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <strong>Keyword Search:</strong>
                        <br />
                        "Search for meeting notes" or "Find tasks about project proposal"
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Common Issues & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">❌ Voice Recognition Not Working</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Check Browser Support:</strong> Use Chrome, Edge, or Safari for best results
                      </p>
                      <p>
                        <strong>Allow Microphone Access:</strong> Grant microphone permissions when prompted
                      </p>
                      <p>
                        <strong>Check Microphone:</strong> Ensure your microphone is working and not muted
                      </p>
                      <p>
                        <strong>Refresh Page:</strong> Sometimes a page refresh resolves connection issues
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-yellow-600">⚠️ Poor Recognition Accuracy</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Reduce Background Noise:</strong> Find a quieter environment
                      </p>
                      <p>
                        <strong>Speak Clearly:</strong> Use normal pace and clear pronunciation
                      </p>
                      <p>
                        <strong>Check Distance:</strong> Stay 6-12 inches from your microphone
                      </p>
                      <p>
                        <strong>Use Keywords:</strong> Include specific terms like "high priority" or "work task"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-blue-600">ℹ️ Commands Not Being Understood</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Use Natural Language:</strong> Speak as you would to a person
                      </p>
                      <p>
                        <strong>Be Specific:</strong> Include all relevant details in one sentence
                      </p>
                      <p>
                        <strong>Wait for Indicator:</strong> Ensure you see "Listening..." before speaking
                      </p>
                      <p>
                        <strong>Try Rephrasing:</strong> Use different words if the first attempt doesn't work
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-green-600">✅ Text-to-Speech Issues</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Check Volume:</strong> Ensure system volume is turned up
                      </p>
                      <p>
                        <strong>Select Different Voice:</strong> Try different voices in settings
                      </p>
                      <p>
                        <strong>Adjust Speech Rate:</strong> Slow down or speed up speech in accessibility controls
                      </p>
                      <p>
                        <strong>Browser Settings:</strong> Check if browser has blocked audio autoplay
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">✅ Fully Supported</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Google Chrome (Desktop & Mobile)</li>
                      <li>• Microsoft Edge</li>
                      <li>• Safari (macOS & iOS)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">❌ Limited/No Support</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Firefox (Limited support)</li>
                      <li>• Internet Explorer</li>
                      <li>• Older browser versions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Need More Help?</strong> If you're still experiencing issues, try refreshing the page, checking
                your browser's microphone permissions, or switching to a supported browser.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
