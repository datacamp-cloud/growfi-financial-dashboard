import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get("limit") ?? 50)

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

  const body = await req.json()
  const userId = session.user.id

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      accountId: body.accountId,
      amount: body.amount,
      type: body.type,
      category: body.category,
      description: body.description ?? "",
      note: body.note ?? "",
      date: body.date ? new Date(body.date) : new Date(),
      source: body.source ?? "manual",
    },
  })

  // Mettre à jour le solde du compte
  await prisma.account.update({
    where: { id: body.accountId },
    data: {
      balance: {
        increment: body.type === "income" ? body.amount : -body.amount,
      },
    },
  })

  return NextResponse.json(transaction, { status: 201 })
}