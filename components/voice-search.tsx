"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VoiceInput } from "./voice-input"
import { Search, Mic } from "lucide-react"

interface VoiceSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function VoiceSearch({ onSearch, placeholder = "Search...", className }: VoiceSearchProps) {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleVoiceTranscriptMemo = useCallback((transcript: string) => {
    setSearchQuery(transcript)
  }, [])

  const handleFinalTranscriptMemo = useCallback(
    (transcript: string) => {
      if (transcript.trim()) {
        onSearch(transcript.trim())
      }
    },
    [onSearch],
  )

  const handleVoiceTranscript = (transcript: string) => {
    setSearchQuery(transcript)
  }

  const handleFinalTranscript = (transcript: string) => {
    if (transcript.trim()) {
      onSearch(transcript.trim())
    }
  }

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleManualSearch()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setIsVoiceMode(!isVoiceMode)}>
          <Mic className="w-4 h-4" />
        </Button>
        <Button onClick={handleManualSearch}>Search</Button>
      </div>

      {isVoiceMode && (
        <VoiceInput
          onTranscriptChange={handleVoiceTranscriptMemo}
          onFinalTranscript={handleFinalTranscriptMemo}
          placeholder="Say what you're looking for..."
        />
      )}
    </div>
  )
}
