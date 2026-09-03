import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { goalSchema } from "@/lib/validation/goal"

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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  const parsed = goalSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données d'objectif invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const goal = await prisma.goal.create({
    data: {
      userId: session.user.id,
      name: data.name,
      icon: data.icon ?? "🎯",
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      color: data.color ?? "#4CAF50",
      deadline: data.deadline ?? null,
    },
  })

  return NextResponse.json(goal, { status: 201 })
}
