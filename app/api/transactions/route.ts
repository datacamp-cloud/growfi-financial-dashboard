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
    include: {
      account: { select: { name: true, icon: true } },
      relatedAccount: { select: { name: true, icon: true } },
    },
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

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { id: data.accountId, userId },
        select: { id: true, balance: true },
      })
      if (!account) throw new Error("SOURCE_ACCOUNT_NOT_FOUND")

      if (data.type !== "income" && account.balance < data.amount) {
        throw new Error("INSUFFICIENT_BALANCE")
      }

      if (data.type === "transfer") {
        const destination = await tx.account.findFirst({
          where: { id: data.relatedAccountId!, userId },
          select: { id: true },
        })
        if (!destination) throw new Error("DESTINATION_ACCOUNT_NOT_FOUND")

        const debited = await tx.account.updateMany({
          where: { id: data.accountId, userId, balance: { gte: data.amount } },
          data: { balance: { decrement: data.amount } },
        })
        if (debited.count !== 1) throw new Error("INSUFFICIENT_BALANCE")

        await tx.account.update({
          where: { id: data.relatedAccountId! },
          data: { balance: { increment: data.amount } },
        })
      } else if (data.type === "income") {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: data.amount } },
        })
      } else {
        const debited = await tx.account.updateMany({
          where: { id: data.accountId, userId, balance: { gte: data.amount } },
          data: { balance: { decrement: data.amount } },
        })
        if (debited.count !== 1) throw new Error("INSUFFICIENT_BALANCE")
      }

      return tx.transaction.create({
        data: {
          userId,
          accountId: data.accountId,
          relatedAccountId: data.relatedAccountId ?? null,
          amount: data.amount,
          type: data.type,
          category: data.type === "transfer" ? "Transfert" : data.category,
          description: data.description ?? "",
          note: data.note ?? "",
          date: data.date ?? new Date(),
          source: data.source,
        },
        include: {
          account: { select: { name: true, icon: true } },
          relatedAccount: { select: { name: true, icon: true } },
        },
      })
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SOURCE_ACCOUNT_NOT_FOUND") {
        return NextResponse.json({ error: "Compte source introuvable" }, { status: 404 })
      }
      if (error.message === "DESTINATION_ACCOUNT_NOT_FOUND") {
        return NextResponse.json({ error: "Compte destination introuvable" }, { status: 404 })
      }
      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json({ error: "Solde insuffisant pour cette opération" }, { status: 400 })
      }
    }

    console.error("Erreur lors de la création de la transaction:", error)
    return NextResponse.json({ error: "Impossible de créer la transaction" }, { status: 500 })
  }
}
