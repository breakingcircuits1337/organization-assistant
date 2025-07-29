"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ExternalLink, Copy, AlertCircle, Sparkles } from "lucide-react"

export function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: "Get your Gemini API Key",
      description: "Visit Google AI Studio to create your API key",
      action: "Visit Google AI Studio",
      link: "https://makersuite.google.com/app/apikey",
      code: null,
    },
    {
      title: "Create environment file",
      description: "Copy the example file and rename it",
      action: "Copy command",
      code: "cp .env.example .env.local",
    },
    {
      title: "Add your API key",
      description: "Edit .env.local and add your Gemini API key",
      action: "Copy template",
      code: `GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000`,
    },
    {
      title: "Restart development server",
      description: "Restart your Next.js development server",
      action: "Copy command",
      code: "npm run dev",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Setup Guide
        </h1>
        <p className="text-muted-foreground">Configure your Gemini API key to enable AI-powered features</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          AI features require a valid Gemini API key. Follow the steps below to set up your environment.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {step.link ? (
                  <Button asChild>
                    <a href={step.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {step.action}
                    </a>
                  </Button>
                ) : step.code ? (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(step.code!, index)}
                    className="flex items-center gap-2"
                  >
                    {copiedStep === index ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedStep === index ? "Copied!" : step.action}
                  </Button>
                ) : null}
              </div>
              {step.code && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Verification
          </CardTitle>
          <CardDescription>Once configured, you'll see AI features throughout the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Tasks</Badge>
              <span className="text-sm">Smart categorization with AI suggestions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Notes</Badge>
              <span className="text-sm">Automatic summarization of note content</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Search</Badge>
              <span className="text-sm">Intelligent search suggestions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>Pro Tip:</strong> The application will show an AI status indicator in the header when properly
          configured. If you see "AI Ready", you're all set!
        </AlertDescription>
      </Alert>
    </div>
  )
}
