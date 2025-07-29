import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalVoiceAssistant } from "@/components/global-voice-assistant"
import { VoiceCommandOverlay } from "@/components/voice-command-overlay"
import { VoiceCommandProvider } from "@/context/voice-command-context" // Import the new provider
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Organizational Assistant",
  description: "A comprehensive task management and note-taking application with AI features",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <VoiceCommandProvider>
            {" "}
            {/* Wrap children with the provider */}
            {children}
            <GlobalVoiceAssistant />
            <VoiceCommandOverlay />
          </VoiceCommandProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
