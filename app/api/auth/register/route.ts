import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })

    // Créer les comptes par défaut
    await prisma.account.createMany({
      data: [
        { userId: user.id, name: "Épargne",      type: "savings",      icon: "💰", color: "#4CAF50" },
        { userId: user.id, name: "Investissement",type: "investment",   icon: "📈", color: "#00BFA5" },
        { userId: user.id, name: "Divertissement",type: "entertainment",icon: "🎮", color: "#FF5252" },
        { userId: user.id, name: "Imprévus",      type: "emergency",   icon: "🛡️", color: "#FFD54F" },
      ],
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}