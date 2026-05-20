import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

// PATCH /api/guestbook/[id]/approve — admin only
export async function PATCH(_req: NextRequest, { params }: Ctx) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.guestbook.update({
    where: { id },
    data: { status: "approved", isApproved: true, approvedAt: new Date() },
  })
  return NextResponse.json({ ok: true })
}
