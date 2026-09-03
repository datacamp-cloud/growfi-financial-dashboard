import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { transactionSchema } from "@/lib/validation/transaction"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const rawLimit = Number(searchParams.get("limit") ?? 50)
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 100) : 50

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: limit,
    include: { account: { select: { name: true, icon: true } } },
  })

  return NextResponse.json(transactions)
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

  const parsed = transactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données de transaction invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const userId = session.user.id

  const account = await prisma.account.findFirst({
    where: { id: data.accountId, userId },
    select: { id: true },
  })

  if (!account) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 })

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId,
          accountId: data.accountId,
          amount: data.amount,
          type: data.type,
          category: data.category,
          description: data.description ?? "",
          note: data.note ?? "",
          date: data.date ?? new Date(),
          source: data.source,
        },
      })

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: data.type === "income" ? data.amount : -data.amount,
          },
        },
      })

      return created
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la transaction:", error)
    return NextResponse.json({ error: "Impossible de créer la transaction" }, { status: 500 })
  }
}
