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

  if (period === "Monthly") {
    // 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      intervals.push({
        label: start.toLocaleDateString("fr-FR", { month: "short" }),
        start, end,
      })
    }
  } else if (period === "Weekly") {
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now)
      start.setDate(now.getDate() - i * 7 - 6)
      const end = new Date(now)
      end.setDate(now.getDate() - i * 7)
      intervals.push({ label: `S-${i}`, start, end })
    }
  } else if (period === "Yearly") {
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear() - i, 0, 1)
      const end = new Date(now.getFullYear() - i, 11, 31, 23, 59, 59)
      intervals.push({ label: `${now.getFullYear() - i}`, start, end })
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
    })
  )

  // Répartition par catégorie (mois en cours)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const categoryData = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "expense", date: { gte: startOfMonth } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  })

  const categoryStats = categoryData.map((c, i) => ({
    name: c.category,
    spent: c._sum.amount ?? 0,
    budget: (c._sum.amount ?? 0) * 1.2, // budget estimé à +20%
    color: ["#4CAF50","#00BFA5","#FFD54F","#FF5252","#2196F3","#9C27B0"][i % 6],
  }))

  return NextResponse.json({ statsData, categoryStats })
}