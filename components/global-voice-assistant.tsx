"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, MicOff, Volume2, Loader2, MessageCircle, X, Lightbulb, Navigation } from "lucide-react"
import { useGlobalVoiceAssistant } from "@/hooks/use-global-voice-assistant"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function GlobalVoiceAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  // Access conversationState from the hook
  const {
    isActive,
    isListening,
    isProcessing,
    lastCommand,
    lastResponse,
    conversationState, // Get conversationState
    startListening,
    stopListening,
    toggleAssistant,
    speak,
    error,
  } = useGlobalVoiceAssistant()

  // Handle voice command actions
  useEffect(() => {
    if (!lastResponse?.success || !lastResponse.action) return

    switch (lastResponse.action) {
      case "navigate":
        if (lastResponse.parameters?.url) {
          router.push(lastResponse.parameters.url)
        }
        break
      case "search":
        if (lastResponse.parameters?.query) {
          router.push(`/search?q=${encodeURIComponent(lastResponse.parameters.query)}`)
        }
        break
      case "create_task_finalized":
        // Navigate to tasks page and potentially open dialog
        router.push("/tasks")
        // The PageVoiceIntegration will handle opening the dialog
        break
      case "create_note_finalized":
        // Navigate to notes page and potentially open dialog
        router.push("/notes")
        // The PageVoiceIntegration will handle opening the dialog
        break
      // No default case needed for "set_state" as it's handled in useGlobalVoiceAssistant hook
    }
  }, [lastResponse, router])

  const handleSuggestionClick = (suggestion: string) => {
    speak(suggestion)
    setShowSuggestions(false)
  }

  const getStatusColor = () => {
    if (error) return "destructive"
    if (isProcessing) return "secondary"
    if (isListening) return "default"
    if (isActive) return "outline"
    return "secondary"
  }

  // Update getStatusText to reflect conversation state
  const getStatusText = () => {
    if (error) return "Error"
    if (isProcessing) return "Processing..."
    if (isListening) return "Listening..."
    if (conversationState !== "idle") return "Awaiting Input..." // New status for multi-turn
    if (isActive) return "Ready"
    return "Inactive"
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Assistant Button */}
      <div className="relative">
        <Button
          onClick={toggleAssistant}
          size="lg"
          className={cn(
            "rounded-full w-14 h-14 shadow-lg transition-all duration-200",
            isActive && "ring-2 ring-primary ring-offset-2",
            isListening && "animate-pulse",
          )}
          variant={isActive ? "default" : "secondary"}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Status Badge */}
        {isActive && (
          <Badge variant={getStatusColor()} className="absolute -top-2 -left-2 text-xs animate-in fade-in-0 zoom-in-95">
            {getStatusText()}
          </Badge>
        )}
      </div>

      {/* Expanded Panel */}
      {isActive && (
        <Card className="absolute bottom-16 right-0 w-80 animate-in slide-in-from-bottom-2 fade-in-0">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(!showSuggestions)}>
                  <Lightbulb className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleAssistant}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                className="flex-1"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>

              <Button onClick={() => speak("Voice assistant is ready to help")} variant="outline" size="sm">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Last Command */}
            {lastCommand && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Last Command:</div>
                <div className="text-sm bg-muted p-2 rounded italic">"{lastCommand}"</div>
              </div>
            )}

            {/* Response */}
            {lastResponse && (
              <Alert className={lastResponse.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className="text-sm">{lastResponse.message}</AlertDescription>
              </Alert>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Suggestions */}
            {showSuggestions && (lastResponse?.suggestions || !lastResponse) && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Try saying:</div>
                <div className="grid gap-1">
                  {(
                    lastResponse?.suggestions || [
                      "Go to tasks",
                      "Create a note",
                      "Search for meetings",
                      "Show my calendar",
                    ]
                  ).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="justify-start text-xs h-8"
                    >
                      "{suggestion}"
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/voice-guide")} className="text-xs">
                <Navigation className="w-3 h-3 mr-1" />
                Voice Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  speak(
                    "I can help you navigate, create tasks and notes, search content, and more. Just speak naturally!",
                  )
                }
                className="text-xs"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Help
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
