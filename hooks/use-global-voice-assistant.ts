"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useSpeechRecognition } from "./use-speech-recognition"
import { useTextToSpeech } from "./use-text-to-speech"
import { useVoiceCommandContext } from "@/context/voice-command-context" // Import the new context

export interface VoiceCommand {
  id: string
  patterns: string[]
  action: string
  parameters?: Record<string, any>
  confidence: number
  context?: string
}

export interface VoiceResponse {
  success: boolean
  message: string
  action?: string
  parameters?: Record<string, any>
  suggestions?: string[]
  reset_state?: boolean // Add reset_state flag
}

interface GlobalVoiceAssistantHook {
  isActive: boolean
  isListening: boolean
  isProcessing: boolean
  lastCommand: string
  lastResponse: VoiceResponse | null
  conversationState: "idle" | "awaiting_task_details" | "awaiting_note_content" | "awaiting_search_query"
  startListening: () => void
  stopListening: () => void
  toggleAssistant: () => void
  executeCommand: (command: string) => Promise<VoiceResponse>
  speak: (text: string) => void
  error: string | null
}

export function useGlobalVoiceAssistant(): GlobalVoiceAssistantHook {
  const [isActive, setIsActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [lastResponse, setLastResponse] = useState<VoiceResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [conversationState, setConversationState] = useState<
    "idle" | "awaiting_task_details" | "awaiting_note_content" | "awaiting_search_query"
  >("idle")

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition()
  const { speak, isSpeaking } = useTextToSpeech()
  const lastTranscriptRef = useRef("")

  const { setPendingTask, setPendingNote, setTriggerDialog } = useVoiceCommandContext() // Use the context setters

  const executeCommand = useCallback(
    async (command: string): Promise<VoiceResponse> => {
      console.log("useGlobalVoiceAssistant: Sending command to API:", { command, conversationState })
      try {
        const response = await fetch("/api/ai/voice-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command,
            context: {
              currentPath: window.location.pathname,
              timestamp: new Date().toISOString(),
              conversationState, // Pass the current conversation state
            },
          }),
        })

        if (!response.ok) {
          const errorBody = await response.json()
          console.error("useGlobalVoiceAssistant: API response not OK:", response.status, errorBody)
          throw new Error(errorBody.message || `HTTP ${response.status}`)
        }

        const result = await response.json()
        console.log("useGlobalVoiceAssistant: Received API response:", result)
        return result
      } catch (error) {
        console.error("useGlobalVoiceAssistant: Voice command execution error:", error)
        return {
          success: false,
          message: "I'm having trouble processing commands right now. Please try again.",
          suggestions: ["Try speaking more clearly", "Check your internet connection", "Use simpler commands"],
        }
      }
    },
    [conversationState],
  )

  // Process voice commands when transcript changes
  useEffect(() => {
    if (!isActive || !transcript || transcript === lastTranscriptRef.current || isListening) return

    const processCommand = async () => {
      if (transcript.trim()) {
        lastTranscriptRef.current = transcript
        setLastCommand(transcript)
        setIsProcessing(true)
        console.log("useGlobalVoiceAssistant: Processing transcript:", transcript, "State:", conversationState)

        try {
          const response = await executeCommand(transcript)
          setLastResponse(response)
          console.log("useGlobalVoiceAssistant: Processed command, response:", response)

          // Handle conversation state changes
          if (response.action === "set_state" && response.parameters?.state) {
            setConversationState(response.parameters.state)
            speak(response.message)
            console.log("useGlobalVoiceAssistant: Setting conversation state to:", response.parameters.state)
          } else if (response.action === "reset_state" || response.reset_state) {
            setConversationState("idle")
            resetTranscript()
            speak(response.message)
            console.log("useGlobalVoiceAssistant: Resetting conversation state to idle.")
          } else if (response.action === "create_task_finalized" && response.parameters) {
            setPendingTask(response.parameters) // Set parsed task data in context
            setTriggerDialog("task") // Trigger task dialog
            setConversationState("idle")
            resetTranscript()
            speak(response.message)
            console.log("useGlobalVoiceAssistant: Task finalized, triggering dialog.")
          } else if (response.action === "create_note_finalized" && response.parameters) {
            setPendingNote(response.parameters) // Set parsed note data in context
            setTriggerDialog("note") // Trigger note dialog
            setConversationState("idle")
            resetTranscript()
            speak(response.message)
            console.log("useGlobalVoiceAssistant: Note finalized, triggering dialog.")
          } else {
            // For other final actions, reset transcript and speak message
            resetTranscript()
            speak(response.message)
            console.log("useGlobalVoiceAssistant: Final action, resetting transcript.")
          }
        } catch (err) {
          console.error("useGlobalVoiceAssistant: Error during command processing:", err)
          const errorMsg = "I encountered an error processing your command. Please try again."
          setLastResponse({ success: false, message: errorMsg })
          speak(errorMsg)
          setConversationState("idle") // Reset state on error
          resetTranscript()
        } finally {
          setIsProcessing(false)
        }
      }
    }

    const timer = setTimeout(processCommand, 1500) // Wait for speech to finish
    return () => clearTimeout(timer)
  }, [
    transcript,
    isListening,
    isActive,
    conversationState,
    speak,
    resetTranscript,
    setPendingTask,
    setPendingNote,
    setTriggerDialog,
    executeCommand,
  ])

  const toggleAssistant = useCallback(() => {
    setIsActive(!isActive)
    if (!isActive) {
      setError(null)
      speak("Voice assistant activated. How can I help you?")
      console.log("useGlobalVoiceAssistant: Assistant activated.")
    } else {
      stopListening()
      speak("Voice assistant deactivated.")
      console.log("useGlobalVoiceAssistant: Assistant deactivated.")
    }
  }, [isActive, speak, stopListening])

  const handleStartListening = useCallback(() => {
    if (!isActive) return
    setError(null)
    resetTranscript()
    startListening()
    console.log("useGlobalVoiceAssistant: Starting listening.")
  }, [isActive, resetTranscript, startListening])

  const handleStopListening = useCallback(() => {
    stopListening()
    console.log("useGlobalVoiceAssistant: Stopping listening.")
  }, [stopListening])

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      setError(speechError)
      speak("I'm having trouble hearing you. Please try again.")
      console.error("useGlobalVoiceAssistant: Speech recognition error:", speechError)
    }
  }, [speechError, speak])

  return {
    isActive,
    isListening,
    isProcessing,
    lastCommand,
    lastResponse,
    conversationState, // Return conversationState
    startListening: handleStartListening,
    stopListening: handleStopListening,
    toggleAssistant,
    executeCommand,
    speak,
    error,
  }
}
