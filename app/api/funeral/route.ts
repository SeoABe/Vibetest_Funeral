import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const funerals = await prisma.funeral.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          guestbook: { where: { status: "pending" } },
        },
      },
    },
  })

  return NextResponse.json(funerals)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  const funeral = await prisma.funeral.create({
    data: {
      slug: body.slug,
      deceasedName: body.deceasedName,
      deceasedPhoto: body.deceasedPhoto ?? null,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      deathDate: new Date(body.deathDate),
      ageText: body.ageText ?? null,
      chiefMourner: body.chiefMourner,
      familyList: body.familyList ?? [],
      obituaryText: body.obituaryText ?? null,
      funeralHome: body.funeralHome,
      funeralHall: body.funeralHall ?? null,
      funeralAddress: body.funeralAddress,
      funeralLat: body.funeralLat,
      funeralLng: body.funeralLng,
      shroudingAt: body.shroudingAt ? new Date(body.shroudingAt) : null,
      visitation: body.visitation ?? null,
      processionAt: body.processionAt ? new Date(body.processionAt) : null,
      burialPlace: body.burialPlace ?? null,
      accounts: body.accounts ?? [],
      guestbookRequiresApproval: body.guestbookRequiresApproval ?? true,
      guestbookMaxLength: body.guestbookMaxLength ?? 300,
      guestbookAllowAnonymous: body.guestbookAllowAnonymous ?? true,
      privateMessageLabel: body.privateMessageLabel ?? null,
      deceasedLetter: body.deceasedLetter ?? null,
      isPublished: body.isPublished ?? false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  })

  return NextResponse.json(funeral, { status: 201 })
}
