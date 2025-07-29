"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Volume2, Zap, BookOpen } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import Link from "next/link"

export function VoiceQuickStart() {
  const { speak, isSpeaking } = useTextToSpeech()

  const quickCommands = [
    {
      category: "Tasks",
      icon: "📋",
      commands: [
        "Create a high priority work task to finish the presentation by Friday",
        "Add a personal task to buy groceries tomorrow",
        "Schedule a health task to call the doctor next week",
      ],
    },
    {
      category: "Notes",
      icon: "📝",
      commands: [
        "Take a note about today's meeting",
        "Create a note about book recommendations",
        "Add a learning note about React concepts",
      ],
    },
    {
      category: "Search",
      icon: "🔍",
      commands: ["Find all high priority tasks", "Show me overdue work tasks", "Search for meeting notes"],
    },
  ]

  const speakCommand = (command: string) => {
    speak(`Try saying: ${command}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Voice Commands Quick Start
        </CardTitle>
        <CardDescription>Get started with voice commands right away. Try these common examples.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Mic className="h-4 w-4" />
          <AlertDescription>
            <strong>Getting Started:</strong> Click the microphone button in any voice-enabled section, wait for the
            "Listening..." indicator, then speak clearly and naturally.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {quickCommands.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                {section.category}
              </h4>
              <div className="space-y-2">
                {section.commands.map((command, cmdIndex) => (
                  <div key={cmdIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm italic">"{command}"</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakCommand(command)}
                      disabled={isSpeaking}
                      className="h-8 w-8 p-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Badge variant="outline">💡 Speak naturally</Badge>
            <Badge variant="outline">🎯 Be specific</Badge>
            <Badge variant="outline">⏱️ Include dates</Badge>
          </div>
          <Link href="/voice-guide">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <BookOpen className="w-4 h-4" />
              Full Guide
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
