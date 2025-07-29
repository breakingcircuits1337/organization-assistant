"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface TextToSpeechHook {
  speak: (text: string, options?: SpeechSynthesisUtterance) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void
}

export function useTextToSpeech(): TextToSpeechHook {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load available voices
  const loadVoices = useCallback(() => {
    if (isSupported) {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // Set default voice (prefer English voices) - only if no voice is selected yet
      if (!selectedVoice && availableVoices.length > 0) {
        const englishVoice = availableVoices.find((voice) => voice.lang.startsWith("en"))
        setSelectedVoice(englishVoice || availableVoices[0])
      }
    }
  }, [isSupported]) // Remove selectedVoice from dependencies to prevent infinite loop

  // Load voices when the component mounts and whenever the voice list changes
  useEffect(() => {
    if (!isSupported) return

    // Initial load
    loadVoices()

    // Listen for voice list changes (e.g., after voices are downloaded)
    speechSynthesis.onvoiceschanged = loadVoices

    // Cleanup listener on unmount
    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [isSupported, loadVoices])

  const speak = useCallback(
    (text: string, options?: Partial<SpeechSynthesisUtterance>) => {
      if (!isSupported || !text.trim()) return

      // Stop any current speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Apply options
      if (options) {
        Object.assign(utterance, options)
      }

      // Set selected voice
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    },
    [isSupported, selectedVoice],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
  }
}
