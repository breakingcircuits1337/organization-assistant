"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, MicOff, Volume2, VolumeX, Settings } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { VoiceHelpButton } from "./voice-help-button"

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void
  onFinalTranscript: (transcript: string) => void
  placeholder?: string
  className?: string
}

export function VoiceInput({ onTranscriptChange, onFinalTranscript, placeholder, className }: VoiceInputProps) {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition()
  const { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice } = useTextToSpeech()
  const [lastTranscript, setLastTranscript] = useState("")

  useEffect(() => {
    onTranscriptChange(transcript)
  }, [transcript]) // Remove callback from dependencies

  useEffect(() => {
    // Detect when speech recognition has finished (transcript stopped changing)
    if (!transcript || isListening) return

    const timer = setTimeout(() => {
      if (transcript !== lastTranscript) {
        onFinalTranscript(transcript)
        setLastTranscript(transcript)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [transcript, isListening, lastTranscript]) // Remove callbacks from dependencies

  const handleStartListening = () => {
    resetTranscript()
    startListening()
  }

  const handleStopListening = () => {
    stopListening()
  }

  const handleTestSpeech = () => {
    const testText =
      "Voice integration is working correctly. You can now use speech-to-text and text-to-speech features."
    speak(testText)
  }

  if (!isSupported) {
    return (
      <Alert>
        <AlertDescription>
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice features.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={isListening ? handleStopListening : handleStartListening}
          className="flex items-center gap-2"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? "Stop Listening" : "Start Voice Input"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={isSpeaking ? stop : handleTestSpeech}
          className="flex items-center gap-2 bg-transparent"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? "Stop" : "Test Speech"}
        </Button>

        <VoiceHelpButton />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voice Settings</DialogTitle>
              <DialogDescription>Configure your voice input and output preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice-select">Text-to-Speech Voice</Label>
                <Select
                  value={selectedVoice?.name || ""}
                  onValueChange={(value) => {
                    const voice = voices.find((v) => v.name === value)
                    setSelectedVoice(voice || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isListening && (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="animate-pulse">
            <Mic className="w-3 h-3 mr-1" />
            Listening...
          </Badge>
        </div>
      )}

      {transcript && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Voice Input:</p>
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      {error && (
        <Alert>
          <AlertDescription>Voice recognition error: {error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
