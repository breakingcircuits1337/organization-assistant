"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Mic, Volume2 } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import Link from "next/link"

interface QuickTip {
  title: string
  command: string
  example: string
}

export function VoiceHelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { speak, isSpeaking } = useTextToSpeech()

  const quickTips: QuickTip[] = [
    {
      title: "Create a Task",
      command: "Create a [priority] [category] task to [action] by [date]",
      example: "Create a high priority work task to finish the report by Friday",
    },
    {
      title: "Take a Note",
      command: "Take a note about [topic]",
      example: "Take a note about today's meeting with the client",
    },
    {
      title: "Search Items",
      command: "Find [criteria]",
      example: "Find all overdue tasks",
    },
    {
      title: "Navigate",
      command: "Go to [page]",
      example: "Go to calendar",
    },
  ]

  const speakTip = (tip: QuickTip) => {
    speak(`${tip.title}. Say: ${tip.example}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <HelpCircle className="w-4 h-4" />
          Voice Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Quick Voice Commands
          </DialogTitle>
          <DialogDescription>
            Here are some common voice commands to get you started. Click the speaker icon to hear examples.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {quickTips.map((tip, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{tip.title}</h4>
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
              <code className="text-xs bg-muted px-2 py-1 rounded block">{tip.command}</code>
              <p className="text-sm text-muted-foreground italic">"{tip.example}"</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            💡 Tip: Speak naturally and clearly
          </Badge>
          <Link href="/voice-guide">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              View Full Guide
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
