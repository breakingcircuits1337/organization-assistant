import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const NoteSchema = z.object({
  title: z.string(),
  content: z.string(),
  createdAt: z.string().optional(),
  tags: z.array(z.string()),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const notes = await prisma.note.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const parsed = NoteSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const note = await prisma.note.create({
    data: { ...parsed.data, userId: user.id, createdAt: parsed.data.createdAt ? new Date(parsed.data.createdAt) : undefined },
  })
  return NextResponse.json(note)
}