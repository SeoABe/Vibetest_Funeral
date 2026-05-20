import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/crypto"
import { checkRateLimit } from "@/lib/rate-limit"
import bcrypt from "bcryptjs"

const HOUR_MS = 60 * 60 * 1000
const GENERIC_ERROR = "비밀번호가 올바르지 않습니다."

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  if (!checkRateLimit(`private-msg:${ip}`, 10, HOUR_MS)) {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 429 })
  }

  const body = await req.json()
  const { funeralId, password } = body as { funeralId?: string; password?: string }

  if (!funeralId || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
  }

  const funeral = await prisma.funeral.findUnique({
    where: { id: funeralId },
    select: {
      isPublished: true,
      privateMessageContent: true,
      privateMessagePassword: true,
    },
  })

  // 비밀번호 존재 여부 노출 금지 — 항상 동일 오류 메시지
  if (
    !funeral?.isPublished ||
    !funeral.privateMessageContent ||
    !funeral.privateMessagePassword
  ) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  const match = await bcrypt.compare(password, funeral.privateMessagePassword)
  if (!match) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  try {
    const content = decrypt(funeral.privateMessageContent)
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 })
  }
}
