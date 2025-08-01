import { NextResponse } from "next/server"
import { z } from "zod"
import { generateJson, rateLimited } from "@/lib/ai"
import { checkRateLimit } from "@/lib/rate-limit"

const ReqSchema = z.object({
  title: z.string(),
  description: z.string().optional()
})
const RespSchema = z.object({
  suggestedDate: z.string()
})

export async function POST(req: Request) {
  const { limited, retryAfter } = checkRateLimit(req)
  if (limited) return NextResponse.json({ error: "Too many requests", retryAfter }, { status: 429 })
  const body = await req.json()
  const parsed = ReqSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  const { title, description } = parsed.data
  const prompt = `Given the following task, suggest a realistic due date in YYYY-MM-DD format that is neither too soon nor too far, based on its title and description.
Title: "${title}"
${description ? `Description: "${description}"` : ""}
Return JSON: { "suggestedDate": "YYYY-MM-DD" }`
  const json = await rateLimited(
    prompt,
    () => generateJson(prompt, RespSchema),
    req.headers.get("x-forwarded-for") || ""
  )
  return NextResponse.json(json)
}