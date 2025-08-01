import { z } from "zod"
import { google } from "@ai-sdk/google"

// Simulate streaming for demo; replace with real generateTextStream in prod
export async function* generateTextStream({ model, prompt }) {
  // For demo: just yield the full prompt as one chunk.
  yield prompt
}

export async function generateJson<T>(prompt: string, schema: z.Schema<T>) {
  const model = google("gemini-1.5-flash")
  const retryAttempts = 2
  for (let i = 0; i <= retryAttempts; i++) {
    try {
      const stream = await generateTextStream({ model, prompt, stream: true })
      const chunks: string[] = []
      for await (const part of stream) chunks.push(part)
      const raw = chunks.join("")
      const parsed = JSON.parse(raw)
      return schema.parse(parsed)
    } catch (err) {
      if (i === retryAttempts) throw err
    }
  }
}

// In-memory cache and rate limit
const promptCache = new Map<string, { ts: number, value: any }>()
const ipCounts = new Map<string, { count: number, reset: number }>()

export async function rateLimited<T>(prompt: string, fn: () => Promise<T>, ip = ""): Promise<T> {
  // Cache by prompt for 60s
  const now = Date.now()
  const cached = promptCache.get(prompt)
  if (cached && now - cached.ts < 60000) return cached.value

  // Per-IP rate limit: 5/min
  if (ip) {
    const entry = ipCounts.get(ip) || { count: 0, reset: now + 60000 }
    if (entry.reset < now) {
      entry.count = 0
      entry.reset = now + 60000
    }
    if (entry.count >= 5) throw Object.assign(new Error("Too many requests"), { code: 429 })
    entry.count++
    ipCounts.set(ip, entry)
  }

  const value = await fn()
  promptCache.set(prompt, { ts: now, value })
  return value
}