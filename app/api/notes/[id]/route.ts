import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const NoteUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  createdAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const note = await prisma.note.findUnique({ where: { id: params.id, userId: user.id } })
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(note)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const parsed = NoteUpdateSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const updated = await prisma.note.update({
    where: { id: params.id, userId: user.id },
    data: { ...parsed.data, createdAt: parsed.data.createdAt ? new Date(parsed.data.createdAt) : undefined },
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.note.delete({ where: { id: params.id, userId: user.id } })
  return NextResponse.json({ ok: true })
}