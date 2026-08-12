import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, profession: true, activity: true, age: true, globalGoal: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      profession: body.profession,
      activity: body.activity,
      age: body.age ? parseInt(body.age) : null,
      globalGoal: body.globalGoal,
    },
    select: { name: true, email: true, profession: true, activity: true, age: true, globalGoal: true },
  })

  return NextResponse.json(user)
}