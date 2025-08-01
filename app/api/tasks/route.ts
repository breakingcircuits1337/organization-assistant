import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const TaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string(),
  category: z.string(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tasks = await prisma.task.findMany({ where: { userId: user.id }, orderBy: { dueDate: "asc" } })
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const parsed = TaskSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const task = await prisma.task.create({
    data: { ...parsed.data, userId: user.id, completed: parsed.data.completed ?? false, dueDate: new Date(parsed.data.dueDate) },
  })
  return NextResponse.json(task)
}