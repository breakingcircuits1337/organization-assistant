import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Enhanced fallback parsing for voice tasks
function parseTaskFallback(transcript: string) {
  const words = transcript.toLowerCase().split(" ")

  // Extract priority
  let priority = "medium"
  if (words.some((w) => ["high", "urgent", "important", "critical"].includes(w))) {
    priority = "high"
  } else if (words.some((w) => ["low", "minor", "later"].includes(w))) {
    priority = "low"
  }

  // Extract category
  let category = ""
  const categoryMap = {
    work: ["work", "job", "office", "meeting", "project", "client"],
    personal: ["personal", "home", "family", "self"],
    health: ["health", "doctor", "gym", "exercise", "medical"],
    learning: ["learn", "study", "read", "course", "book"],
    finance: ["finance", "money", "pay", "bill", "budget"],
  }

  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((keyword) => words.includes(keyword))) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1)
      break
    }
  }

  // Extract date references
  let dueDate = ""
  const today = new Date()

  if (words.includes("today")) {
    dueDate = today.toISOString().split("T")[0]
  } else if (words.includes("tomorrow")) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    dueDate = tomorrow.toISOString().split("T")[0]
  } else if (words.includes("friday")) {
    const friday = new Date(today)
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7
    friday.setDate(friday.getDate() + daysUntilFriday)
    dueDate = friday.toISOString().split("T")[0]
  } else if (words.includes("next week")) {
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    dueDate = nextWeek.toISOString().split("T")[0]
  } else if (words.includes("next month")) {
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    dueDate = nextMonth.toISOString().split("T")[0]
  }

  return {
    title: transcript,
    description: "",
    dueDate,
    category,
    priority,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()
    console.log(`parse-voice-task/route: Incoming transcript: "${transcript}"`)

    if (!transcript) {
      console.log("parse-voice-task/route: No transcript provided.")
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    // Try AI parsing first
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        console.log("parse-voice-task/route: Attempting AI parsing.")
        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: `Parse this voice input into a structured task. Extract the task title, an optional description, a due date, a category, and a priority.

Voice Input: "${transcript}"

Categories: Work, Personal, Health, Learning, Finance (If a category is not explicitly mentioned or clearly implied, leave it as an empty string.)
Priorities: low, medium, high (Default to 'medium' if not specified.)
Dates: Convert natural language (e.g., "today", "tomorrow", "Friday", "next week", "December 15th") to YYYY-MM-DD format. If no date is mentioned, leave it as an empty string.

Return a JSON object with the following structure:
{
  "title": "clear and concise task title",
  "description": "optional detailed description (can be empty string)",
  "dueDate": "YYYY-MM-DD or empty string",
  "category": "Work|Personal|Health|Learning|Finance or empty string",
  "priority": "low|medium|high"
}

Be smart about interpreting natural language. If a field is unclear or not mentioned, use the default or an empty string as specified. The title should capture the main action.`,
        })

        const parsedTask = JSON.parse(text)
        console.log("parse-voice-task/route: AI parsed task:", parsedTask)
        return NextResponse.json(parsedTask)
      } catch (aiError) {
        console.error("parse-voice-task/route: AI parsing failed, falling back:", aiError)
        // Fall through to fallback
      }
    }

    // Use enhanced fallback parsing
    const fallbackTask = parseTaskFallback(transcript)
    console.log("parse-voice-task/route: Using fallback task parsing:", fallbackTask)
    return NextResponse.json(fallbackTask)
  } catch (error) {
    console.error("parse-voice-task/route: Top-level error parsing voice task:", error)
    return NextResponse.json(
      {
        title: "",
        description: "",
        dueDate: "",
        category: "",
        priority: "medium",
        error: "Failed to process task details.",
      },
      { status: 500 },
    )
  }
}
