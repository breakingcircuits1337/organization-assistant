"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Volume2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useGlobalVoiceAssistant } from "@/hooks/use-global-voice-assistant"
import { cn } from "@/lib/utils"

export function VoiceCommandOverlay() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)

  const { isActive, isListening, isProcessing, lastCommand, lastResponse, speak } = useGlobalVoiceAssistant()

  // Show overlay when voice assistant is active and processing
  useEffect(() => {
    if (isActive && (isListening || isProcessing || lastResponse)) {
      setShowOverlay(true)

      // Auto-hide after response
      if (lastResponse && !isListening && !isProcessing) {
        const timer = setTimeout(() => {
          setShowOverlay(false)
        }, 3000)
        setAutoHideTimer(timer)
      }
    } else if (!isActive) {
      setShowOverlay(false)
    }

    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }, [isActive, isListening, isProcessing, lastResponse])

  if (!showOverlay) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in-0">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                isListening && "bg-red-100 text-red-600 animate-pulse",
                isProcessing && "bg-blue-100 text-blue-600",
                lastResponse?.success && "bg-green-100 text-green-600",
                lastResponse && !lastResponse.success && "bg-orange-100 text-orange-600",
              )}
            >
              {isListening && <Mic className="w-5 h-5" />}
              {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
              {lastResponse?.success && <CheckCircle className="w-5 h-5" />}
              {lastResponse && !lastResponse.success && <AlertCircle className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isListening && (
                <div>
                  <Badge variant="destructive" className="mb-1">
                    Listening...
                  </Badge>
                  <p className="text-sm text-muted-foreground">Speak your command</p>
                </div>
              )}

              {isProcessing && (
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Processing...
                  </Badge>
                  {lastCommand && <p className="text-sm text-muted-foreground truncate">"{lastCommand}"</p>}
                </div>
              )}

              {lastResponse && !isListening && !isProcessing && (
                <div>
                  <Badge variant={lastResponse.success ? "default" : "destructive"} className="mb-1">
                    {lastResponse.success ? "Success" : "Error"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{lastResponse.message}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {lastResponse?.message && (
                <Button variant="ghost" size="sm" onClick={() => speak(lastResponse.message)} className="h-8 w-8 p-0">
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {lastResponse?.suggestions && lastResponse.suggestions.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2">Try:</div>
              <div className="flex flex-wrap gap-1">
                {lastResponse.suggestions.slice(0, 3).map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-muted"
                    onClick={() => speak(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
