import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [accounts, recentTransactions, goals, monthlyStats] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 6,
      include: { account: { select: { name: true } } },
    }),
    prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ])

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const monthlyIncome = monthlyStats.find((s) => s.type === "income")?._sum.amount ?? 0
  const monthlyExpenses = monthlyStats.find((s) => s.type === "expense")?._sum.amount ?? 0
  const savingsRate = monthlyIncome > 0
    ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0

  return NextResponse.json({
    user: { name: session.user.name, email: session.user.email },
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    accounts,
    recentTransactions,
    goals,
  })
}