"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react"

type AIStatus = "checking" | "available" | "unavailable" | "error"

export function AIStatusIndicator() {
  const [status, setStatus] = useState<AIStatus>("checking")

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const response = await fetch("/api/ai/status")
        if (response.ok) {
          setStatus("available")
        } else {
          setStatus("unavailable")
        }
      } catch (error) {
        setStatus("error")
      }
    }

    checkAIStatus()
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "checking":
        return {
          icon: Sparkles,
          text: "Checking AI...",
          variant: "secondary" as const,
          className: "animate-pulse",
        }
      case "available":
        return {
          icon: CheckCircle,
          text: "AI Ready",
          variant: "default" as const,
          className: "text-green-600",
        }
      case "unavailable":
        return {
          icon: AlertCircle,
          text: "AI Unavailable",
          variant: "destructive" as const,
          className: "text-red-600",
        }
      case "error":
        return {
          icon: AlertCircle,
          text: "AI Error",
          variant: "destructive" as const,
          className: "text-red-600",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} text-xs`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  )
}
