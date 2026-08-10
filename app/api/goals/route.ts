import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const goal = await prisma.goal.create({
    data: {
      userId: session.user.id,
      name: body.name,
      icon: body.icon ?? "🎯",
      targetAmount: body.targetAmount,
      currentAmount: body.currentAmount ?? 0,
      color: body.color ?? "#4CAF50",
      deadline: body.deadline ? new Date(body.deadline) : null,
    },
  })

  return NextResponse.json(goal, { status: 201 })
}