import { NextResponse } from "next/server"
import { z } from "zod"
import { generateJson, rateLimited } from "@/lib/ai"
import { checkRateLimit } from "@/lib/rate-limit"

const ReqSchema = z.object({
  commandText: z.string()
})
const OpSchema = z.object({
  type: z.enum(["update", "toggle"]),
  filter: z.object({
    overdue: z.boolean().optional()
    // Extend for more filters as needed
  }).optional(),
  data: z.record(z.any()).optional()
})
const RespSchema = z.array(OpSchema)

export async function POST(req: Request) {
  const { limited, retryAfter } = checkRateLimit(req)
  if (limited) return NextResponse.json({ error: "Too many requests", retryAfter }, { status: 429 })
  const body = await req.json()
  const parsed = ReqSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  const { commandText } = parsed.data
  const prompt = `Interpret this bulk task command and return a JSON array of operations to perform:
Command: """${commandText}"""
Each op: { "type": "update"|"toggle", "filter": { "overdue": true|false }, "data": { ...fields } }
Only return valid operations.`
  const json = await rateLimited(prompt, () => generateJson(prompt, RespSchema), req.headers.get("x-forwarded-for") || "")
  return NextResponse.json(json)
}