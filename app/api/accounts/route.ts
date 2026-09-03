import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { accountSchema } from "@/lib/validation/account"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(accounts)
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

  const parsed = accountSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données de compte invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const account = await prisma.account.create({
    data: {
      userId: session.user.id,
      name: data.name,
      type: data.type,
      icon: data.icon ?? "💰",
      color: data.color ?? "#4CAF50",
    },
  })

  return NextResponse.json(account, { status: 201 })
}
