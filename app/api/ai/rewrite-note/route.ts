import { NextResponse } from "next/server"
import { z } from "zod"
import { generateJson, rateLimited } from "@/lib/ai"
import { checkRateLimit } from "@/lib/rate-limit"

const ReqSchema = z.object({
  content: z.string(),
  tone: z.enum(["concise", "professional", "friendly"])
})
const RespSchema = z.object({
  rewritten: z.string()
})

export async function POST(req: Request) {
  const { limited, retryAfter } = checkRateLimit(req)
  if (limited) return NextResponse.json({ error: "Too many requests", retryAfter }, { status: 429 })
  const body = await req.json()
  const parsed = ReqSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  const { content, tone } = parsed.data
  const prompt = `Rewrite the following note in a ${tone} tone. Return only the rewritten note as { "rewritten": "..." }
Note: """${content}"""`
  const json = await rateLimited(prompt, () => generateJson(prompt, RespSchema), req.headers.get("x-forwarded-for") || "")
  return NextResponse.json(json)
}