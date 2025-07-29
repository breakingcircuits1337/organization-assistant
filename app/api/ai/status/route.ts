import { NextResponse } from "next/server"
import { google } from "@ai-sdk/google"

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          status: "unavailable",
          message: "GOOGLE_GENERATIVE_AI_API_KEY is not configured",
        },
        { status: 500 },
      )
    }

    // Test the API key with a simple request
    const { generateText } = await import("ai")

    await generateText({
      model: google("gemini-1.5-flash", {
        apiKeyOrAccessToken: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      prompt: "Hello",
      maxTokens: 5,
    })

    return NextResponse.json({
      status: "available",
      message: "AI services are operational",
    })
  } catch (error) {
    console.error("AI status check failed:", error)

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        {
          status: "unauthorized",
          message: "Invalid API key",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        status: "error",
        message: "AI services are currently unavailable",
      },
      { status: 500 },
    )
  }
}
