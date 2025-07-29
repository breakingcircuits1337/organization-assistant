"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceInput } from "./voice-input"
import { Mic, FileText, Sparkles, Loader2 } from "lucide-react"

interface VoiceNoteCreatorProps {
  onNoteCreate: (note: {
    title: string
    content: string
    tags: string
  }) => void
}

export function VoiceNoteCreator({ onNoteCreate }: VoiceNoteCreatorProps) {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const handleVoiceTranscriptMemo = useCallback((transcript: string) => {
    setNote((prev) => ({ ...prev, content: transcript }))
  }, [])

  const handleFinalTranscriptMemo = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    try {
      // Use AI to generate title and tags from the voice content
      const response = await fetch("/api/ai/parse-voice-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: transcript }),
      })

      if (response.ok) {
        const { title, tags } = await response.json()
        setNote((prev) => ({
          ...prev,
          content: transcript,
          title: title || prev.title,
          tags: tags || prev.tags,
        }))
      } else {
        setNote((prev) => ({ ...prev, content: transcript }))
      }
    } catch (error) {
      console.error("Failed to parse voice note:", error)
      setNote((prev) => ({ ...prev, content: transcript }))
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleSubmit = () => {
    if (note.title && note.content) {
      onNoteCreate(note)
      setNote({
        title: "",
        content: "",
        tags: "",
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
              <FileText className="w-5 h-5" />
              Voice Note Creator
            </CardTitle>
            <CardDescription>Create notes using voice dictation or traditional typing</CardDescription>
          </div>
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            {isVoiceMode ? "Switch to Typing" : "Use Voice"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVoiceMode && (
          <VoiceInput
            onTranscriptChange={handleVoiceTranscriptMemo}
            onFinalTranscript={handleFinalTranscriptMemo}
            placeholder="Start speaking to create your note. AI will automatically generate a title and tags."
          />
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating title and tags with AI...
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              placeholder="Enter note title (or let AI generate it)"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Enter note content or use voice input"
              className="min-h-[200px]"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={note.tags}
              onChange={(e) => setNote({ ...note, tags: e.target.value })}
              placeholder="Enter tags separated by commas (or let AI suggest them)"
            />
          </div>

          <Button onClick={handleSubmit} disabled={!note.title || !note.content} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
