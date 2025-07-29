"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Volume2, Loader2, CheckCircle, AlertCircle, Zap, Brain, MessageSquare } from "lucide-react"
import { useGlobalVoiceAssistant } from "@/hooks/use-global-voice-assistant"
import { cn } from "@/lib/utils"

export function EnhancedVoiceFeedback() {
  const [confidence, setConfidence] = useState(0)
  const [processingStage, setProcessingStage] = useState("")

  const { isActive, isListening, isProcessing, lastCommand, lastResponse, speak } = useGlobalVoiceAssistant()

  // Simulate processing stages for better UX
  useEffect(() => {
    if (isProcessing) {
      const stages = ["Analyzing speech...", "Understanding intent...", "Processing command...", "Executing action..."]

      let currentStage = 0
      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          setProcessingStage(stages[currentStage])
          setConfidence((currentStage + 1) * 25)
          currentStage++
        }
      }, 500)

      return () => clearInterval(interval)
    } else {
      setProcessingStage("")
      setConfidence(0)
    }
  }, [isProcessing])

  if (!isActive) return null

  return (
    <div className="fixed top-20 right-4 z-40 w-80">
      <Card className="shadow-lg border animate-in slide-in-from-right-2 fade-in-0">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">AI Voice Assistant</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {isListening ? "Listening" : isProcessing ? "Processing" : "Ready"}
            </Badge>
          </div>

          {/* Voice Visualization */}
          {isListening && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("w-1 bg-primary rounded-full animate-pulse", "h-4 animate-bounce")}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.6s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processing Stage */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-muted-foreground">{processingStage}</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          )}

          {/* Command Display */}
          {lastCommand && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium">Command Recognized:</span>
              </div>
              <div className="bg-muted p-2 rounded text-sm italic">"{lastCommand}"</div>
            </div>
          )}

          {/* Response */}
          {lastResponse && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {lastResponse.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs font-medium">{lastResponse.success ? "Success" : "Error"}</span>
              </div>
              <div className="text-sm text-muted-foreground">{lastResponse.message}</div>

              {/* Action Feedback */}
              {lastResponse.action && (
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span>Action: {lastResponse.action.replace("_", " ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speak("I'm ready to help. What would you like to do?")}
              className="flex-1 text-xs"
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Repeat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speak("Try saying: go to tasks, create a note, or search for something")}
              className="flex-1 text-xs"
            >
              <Mic className="w-3 h-3 mr-1" />
              Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
