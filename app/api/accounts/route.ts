import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

  const body = await req.json()
  const account = await prisma.account.create({
    data: {
      userId: session.user.id,
      name: body.name,
      type: body.type,
      icon: body.icon ?? "💰",
      color: body.color ?? "#4CAF50",
    },
  })

  return NextResponse.json(account, { status: 201 })
}