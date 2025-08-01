const buckets = new Map<string, { count: number, reset: number }>()

export function checkRateLimit(req: Request, max = 5, windowMs = 60000) {
  // Get IP
  const ip =
    req.headers.get("x-forwarded-for") ||
    (req as any).ip ||
    "127.0.0.1"

  const now = Date.now()
  const entry = buckets.get(ip) || { count: 0, reset: now + windowMs }
  if (entry.reset < now) {
    entry.count = 0
    entry.reset = now + windowMs
  }
  if (entry.count >= max) {
    return { limited: true, retryAfter: Math.ceil((entry.reset - now) / 1000) }
  }
  entry.count++
  buckets.set(ip, entry)
  return { limited: false }
}