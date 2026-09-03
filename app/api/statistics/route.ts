import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const userId = session.user.id
  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") ?? "Monthly"
  const now = new Date()
  let intervals: { label: string; start: Date; end: Date }[] = []

  if (period === "Daily") {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - i)
      const end = new Date(start)
      end.setHours(23, 59, 59, 999)
      intervals.push({
        label: start.toLocaleDateString("fr-FR", { weekday: "short" }),
        start,
        end,
      })
    }
  } else if (period === "Weekly") {
    for (let i = 5; i >= 0; i--) {
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      end.setDate(end.getDate() - i * 7)
      const start = new Date(end)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - 6)
      intervals.push({ label: `S-${6 - i}`, start, end })
    }
  } else if (period === "Yearly") {
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear() - i, 0, 1)
      const end = new Date(now.getFullYear() - i, 11, 31, 23, 59, 59, 999)
      intervals.push({ label: `${now.getFullYear() - i}`, start, end })
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
      intervals.push({
        label: start.toLocaleDateString("fr-FR", { month: "short" }),
        start,
        end,
      })
    }
  }

  const statsData = await Promise.all(
    intervals.map(async ({ label, start, end }) => {
      const [income, expenses] = await Promise.all([
        prisma.transaction.aggregate({
          where: { userId, type: "income", date: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { userId, type: "expense", date: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
      ])
      return {
        label,
        income: income._sum.amount ?? 0,
        expenses: expenses._sum.amount ?? 0,
      }
    }),
  )

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const categoryData = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "expense", date: { gte: startOfMonth } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  })

  const totalCategorySpend = categoryData.reduce((sum, category) => sum + (category._sum.amount ?? 0), 0)
  const categoryStats = categoryData.map((category, i) => ({
    name: category.category,
    spent: category._sum.amount ?? 0,
    share: totalCategorySpend > 0
      ? Math.round(((category._sum.amount ?? 0) / totalCategorySpend) * 100)
      : 0,
    color: ["#4CAF50", "#00BFA5", "#FFD54F", "#FF5252", "#2196F3", "#9C27B0"][i % 6],
  }))

  return NextResponse.json({ statsData, categoryStats })
}
