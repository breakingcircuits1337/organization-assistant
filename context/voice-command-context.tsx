"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

// Define interfaces for parsed task and note data
interface ParsedTask {
  title: string
  description: string
  dueDate: string
  category: string
  priority: "low" | "medium" | "high"
}

interface ParsedNote {
  title: string
  content: string
  tags: string
}

// Define the shape of the context value
interface VoiceCommandContextType {
  pendingTask: ParsedTask | null
  setPendingTask: (task: ParsedTask | null) => void
  pendingNote: ParsedNote | null
  setPendingNote: (note: ParsedNote | null) => void
  triggerDialog: "task" | "note" | null
  setTriggerDialog: (dialogType: "task" | "note" | null) => void
}

// Create the context
const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined)

// Create the provider component
export function VoiceCommandProvider({ children }: { children: ReactNode }) {
  const [pendingTask, setPendingTask] = useState<ParsedTask | null>(null)
  const [pendingNote, setPendingNote] = useState<ParsedNote | null>(null)
  const [triggerDialog, setTriggerDialog] = useState<"task" | "note" | null>(null)

  const contextValue = {
    pendingTask,
    setPendingTask,
    pendingNote,
    setPendingNote,
    triggerDialog,
    setTriggerDialog,
  }

  return <VoiceCommandContext.Provider value={contextValue}>{children}</VoiceCommandContext.Provider>
}

// Custom hook to consume the context
export function useVoiceCommandContext() {
  const context = useContext(VoiceCommandContext)
  if (context === undefined) {
    throw new Error("useVoiceCommandContext must be used within a VoiceCommandProvider")
  }
  return context
}
