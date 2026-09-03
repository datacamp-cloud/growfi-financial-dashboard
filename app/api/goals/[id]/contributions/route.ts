import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const contributionSchema = z.object({
  accountId: z.string().min(1),
  amount: z.coerce.number().finite().positive("Le montant doit être supérieur à 0"),
  note: z.string().trim().max(200).optional().nullable(),
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const goal = await prisma.goal.findFirst({
    where: { id, userId: session.user.id },
    include: {
      transactions: {
        where: { category: "Objectif" },
        orderBy: { date: "desc" },
        include: { account: { select: { name: true, icon: true } } },
      },
    },
  })

  if (!goal) return NextResponse.json({ error: "Objectif introuvable" }, { status: 404 })
  return NextResponse.json(goal.transactions)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  const parsed = contributionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 })
  }

  const { accountId, amount, note } = parsed.data

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [goal, account] = await Promise.all([
        tx.goal.findFirst({ where: { id, userId: session.user.id } }),
        tx.account.findFirst({ where: { id: accountId, userId: session.user.id } }),
      ])

      if (!goal) throw new Error("GOAL_NOT_FOUND")
      if (!account) throw new Error("ACCOUNT_NOT_FOUND")
      if (goal.currentAmount + amount > goal.targetAmount) throw new Error("GOAL_EXCEEDED")

      const debited = await tx.account.updateMany({
        where: { id: accountId, userId: session.user.id, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      })
      if (debited.count !== 1) throw new Error("INSUFFICIENT_BALANCE")

      const transaction = await tx.transaction.create({
        data: {
          userId: session.user.id,
          accountId,
          goalId: goal.id,
          amount,
          type: "transfer",
          category: "Objectif",
          description: `Contribution à ${goal.name}`,
          note: note || null,
          source: "manual",
        },
        include: { account: { select: { name: true, icon: true } } },
      })

      const updatedGoal = await tx.goal.update({
        where: { id: goal.id },
        data: { currentAmount: { increment: amount } },
      })

      return { transaction, goal: updatedGoal }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN"
    const messages: Record<string, string> = {
      GOAL_NOT_FOUND: "Objectif introuvable",
      ACCOUNT_NOT_FOUND: "Compte introuvable",
      GOAL_EXCEEDED: "Cette contribution dépasserait le montant cible",
      INSUFFICIENT_BALANCE: "Solde insuffisant pour cette contribution",
    }
    return NextResponse.json({ error: messages[code] ?? "Impossible d'ajouter la contribution" }, { status: 400 })
  }
}
