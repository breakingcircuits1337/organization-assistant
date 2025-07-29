"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { Volume2, VolumeX, Accessibility } from "lucide-react"

export function AccessibilityControls() {
  const { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice } = useTextToSpeech()
  const [speechRate, setSpeechRate] = useState([1])
  const [speechPitch, setSpeechPitch] = useState([1])
  const [speechVolume, setSpeechVolume] = useState([1])
  const [autoReadEnabled, setAutoReadEnabled] = useState(false)

  const handleTestSpeech = () => {
    const testText = "This is a test of the text-to-speech functionality with your current settings."
    speak(testText, {
      rate: speechRate[0],
      pitch: speechPitch[0],
      volume: speechVolume[0],
    })
  }

  const speakText = (text: string) => {
    if (autoReadEnabled) {
      speak(text, {
        rate: speechRate[0],
        pitch: speechPitch[0],
        volume: speechVolume[0],
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Accessibility Controls
        </CardTitle>
        <CardDescription>Configure text-to-speech and accessibility features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-read">Auto-read content</Label>
          <Switch id="auto-read" checked={autoReadEnabled} onCheckedChange={setAutoReadEnabled} />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="voice-select">Voice</Label>
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

          <div>
            <Label>Speech Rate: {speechRate[0]}</Label>
            <Slider value={speechRate} onValueChange={setSpeechRate} max={2} min={0.5} step={0.1} className="mt-2" />
          </div>

          <div>
            <Label>Speech Pitch: {speechPitch[0]}</Label>
            <Slider value={speechPitch} onValueChange={setSpeechPitch} max={2} min={0.5} step={0.1} className="mt-2" />
          </div>

          <div>
            <Label>Speech Volume: {speechVolume[0]}</Label>
            <Slider value={speechVolume} onValueChange={setSpeechVolume} max={1} min={0} step={0.1} className="mt-2" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleTestSpeech} disabled={isSpeaking} className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Test Speech
          </Button>
          <Button
            onClick={stop}
            disabled={!isSpeaking}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <VolumeX className="w-4 h-4" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
