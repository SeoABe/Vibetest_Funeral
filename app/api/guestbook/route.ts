import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"

const HOUR_MS = 60 * 60 * 1000

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

// GET /api/guestbook?funeralId=xxx&cursor=xxx&limit=10
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const funeralId = searchParams.get("funeralId")
  const cursor = searchParams.get("cursor")
  const limit = Math.min(Number(searchParams.get("limit") ?? 10), 50)

  if (!funeralId) return NextResponse.json({ error: "funeralId required" }, { status: 400 })

  const entries = await prisma.guestbook.findMany({
    where: { funeralId, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: { id: true, authorName: true, message: true, createdAt: true },
  })

  const hasMore = entries.length > limit
  const items = hasMore ? entries.slice(0, limit) : entries
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return NextResponse.json({ items, nextCursor })
}

// POST /api/guestbook
export async function POST(req: NextRequest) {
  const ip = getIp(req)
  if (!checkRateLimit(`guestbook:${ip}`, 10, HOUR_MS)) {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 429 })
  }

  const body = await req.json()
  const { funeralId, authorName, message } = body as {
    funeralId?: string
    authorName?: string
    message?: string
  }

  if (!funeralId || !authorName?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 })
  }

  const funeral = await prisma.funeral.findUnique({
    where: { id: funeralId, isPublished: true },
    select: { guestbookMaxLength: true, guestbookRequiresApproval: true },
  })
  if (!funeral) return NextResponse.json({ error: "not found" }, { status: 404 })

  if (message.trim().length > funeral.guestbookMaxLength) {
    return NextResponse.json(
      { error: `내용은 ${funeral.guestbookMaxLength}자 이내로 입력해주세요.` },
      { status: 400 }
    )
  }

  const status = funeral.guestbookRequiresApproval ? "pending" : "approved"
  const entry = await prisma.guestbook.create({
    data: {
      funeralId,
      authorName: authorName.trim().slice(0, 20),
      message: message.trim(),
      status,
      isApproved: !funeral.guestbookRequiresApproval,
      ...(funeral.guestbookRequiresApproval ? {} : { approvedAt: new Date() }),
    },
    select: { id: true, status: true },
  })

  return NextResponse.json({ id: entry.id, status: entry.status }, { status: 201 })
}
