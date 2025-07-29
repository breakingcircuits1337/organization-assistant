"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceTaskCreator } from "@/components/voice-task-creator"
import { VoiceNoteCreator } from "@/components/voice-note-creator"
import { VoiceSearch } from "@/components/voice-search"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIStatusIndicator } from "@/components/ai-status-indicator"
import { Mic, FileText, Search, Settings } from "lucide-react"
import Link from "next/link"
import { VoiceQuickStart } from "@/components/voice-quick-start"

export default function VoicePage() {
  const categories = ["Work", "Personal", "Health", "Learning", "Finance"]

  const handleTaskCreate = (task: any) => {
    console.log("Creating task:", task)
    // Here you would typically save the task to your state/database
  }

  const handleNoteCreate = (note: any) => {
    console.log("Creating note:", note)
    // Here you would typically save the note to your state/database
  }

  const handleSearch = (query: string) => {
    console.log("Searching for:", query)
    // Here you would typically perform the search
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Mic className="w-8 h-8" />
                Voice Assistant
              </h1>
              <p className="text-muted-foreground">Create tasks and notes using voice commands</p>
            </div>
            <div className="flex items-center space-x-4">
              <AIStatusIndicator />
              <ThemeToggle />
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
            <Link href="/voice" className="border-b-2 border-primary py-4 px-1 text-primary font-medium">
              Voice Assistant
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Start Guide */}
        <VoiceQuickStart />

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Tasks
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Voice Notes
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Voice Search
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <VoiceTaskCreator onTaskCreate={handleTaskCreate} categories={categories} />
          </TabsContent>

          <TabsContent value="notes">
            <VoiceNoteCreator onNoteCreate={handleNoteCreate} />
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Voice Search
                </CardTitle>
                <CardDescription>Search your tasks and notes using voice commands</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceSearch onSearch={handleSearch} placeholder="Search tasks and notes..." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AccessibilityControls />
          </TabsContent>
        </Tabs>

        {/* Voice Features Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Voice Features Overview</CardTitle>
            <CardDescription>Learn how to use voice commands effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Task Creation</h4>
                <p className="text-sm text-muted-foreground">
                  Say: "Create a task to finish the project proposal by Friday with high priority in the work category"
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Note Taking</h4>
                <p className="text-sm text-muted-foreground">
                  Speak naturally and AI will automatically generate titles and tags for your notes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Voice Search</h4>
                <p className="text-sm text-muted-foreground">
                  Say: "Find all high priority work tasks" or "Show me notes about meetings"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
