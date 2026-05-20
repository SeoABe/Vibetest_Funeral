import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const funeral = await prisma.funeral.findUnique({ where: { id } })
  if (!funeral) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(funeral)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}

  const fields = [
    "slug", "deceasedName", "deceasedPhoto", "ageText", "chiefMourner",
    "familyList", "obituaryText", "funeralHome", "funeralHall",
    "funeralAddress", "funeralLat", "funeralLng", "visitation",
    "burialPlace", "accounts", "guestbookRequiresApproval",
    "guestbookMaxLength", "guestbookAllowAnonymous",
    "privateMessageLabel", "isPublished", "expiresAt",
  ]
  for (const f of fields) {
    if (f in body) data[f] = body[f]
  }

  const dateFields = ["birthDate", "deathDate", "shroudingAt", "processionAt", "publishedAt"]
  for (const f of dateFields) {
    if (f in body) data[f] = body[f] ? new Date(body[f]) : null
  }

  if ("isPublished" in body && body.isPublished && !body.publishedAt) {
    data.publishedAt = new Date()
  }

  const funeral = await prisma.funeral.update({ where: { id }, data })
  return NextResponse.json(funeral)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.funeral.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
