import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not configured")
      return NextResponse.json(
        { error: "AI service is not configured. Please check your environment variables." },
        { status: 500 },
      )
    }

    const { query, tasks, notes } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Create context from tasks and notes
    const taskTitles = tasks.map((task: any) => task.title).join(", ")
    const noteTitles = notes.map((note: any) => note.title).join(", ")

    // The Gemini API key should be set in the environment, not passed as an option
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Based on the user's search query and their existing tasks and notes, suggest 3-5 relevant search terms or phrases that might help them find what they're looking for.

Search Query: "${query}"

Existing Task Titles: ${taskTitles}
Existing Note Titles: ${noteTitles}

Provide suggestions as a JSON array of strings. Each suggestion should be a short, relevant search term or phrase.`,
    })

    try {
      const suggestions = JSON.parse(text)
      return NextResponse.json({ suggestions })
    } catch {
      // Fallback if JSON parsing fails
      const suggestions = text
        .split("\n")
        .filter((s) => s.trim())
        .slice(0, 5)
      return NextResponse.json({ suggestions })
    }
  } catch (error) {
    console.error("Error generating search suggestions:", error)

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Gemini API configuration." },
        { status: 401 },
      )
    }

    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
