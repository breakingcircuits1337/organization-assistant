import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// helper: naive fallback summariser – first 2 sentences or 200 chars
function basicSummary(text: string) {
  const sentences = text
    .replace(/\n+/g, " ") // collapse line-breaks
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
  const short = sentences.slice(0, 2).join(" ")
  return short.length > 0 ? short : text.slice(0, 200)
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // ---------- 1) ENV-VAR NOT SET → local summary & 200 ----------
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not configured – using local summary.")
      return NextResponse.json({ summary: basicSummary(content) })
    }
    // --------------------------------------------------------------

    // ---------- 2) Normal Gemini flow when API key is present -----
    const { text } = await generateText({
      model: google("gemini-1.5-flash", process.env.GOOGLE_GENERATIVE_AI_API_KEY),
      prompt: `Summarize the following note content in 2-3 concise sentences.\n\n${content}`,
    })

    return NextResponse.json({ summary: text.trim() })
    // --------------------------------------------------------------
  } catch (error) {
    console.error("Error summarizing note:", error)
    // keep existing error handling
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Gemini API configuration." },
        { status: 401 },
      )
    }
    return NextResponse.json({ error: "Failed to summarize note" }, { status: 500 })
  }
}
