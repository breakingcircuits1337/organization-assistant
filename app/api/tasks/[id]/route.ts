import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const TaskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const task = await prisma.task.findUnique({ where: { id: params.id, userId: user.id } })
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(task)
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
  const parsed = TaskUpdateSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const updated = await prisma.task.update({
    where: { id: params.id, userId: user.id },
    data: { ...parsed.data, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined },
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

  await prisma.task.delete({ where: { id: params.id, userId: user.id } })
  return NextResponse.json({ ok: true })
}