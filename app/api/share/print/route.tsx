import React from "react"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"

let cachedFont: Buffer | null = null
function getFont(): Buffer {
  if (!cachedFont) {
    cachedFont = readFileSync(join(process.cwd(), "public", "fonts", "NotoSansKR-Medium.ttf"))
  }
  return cachedFont
}

function fmt(date: Date | null | undefined, opts: Intl.DateTimeFormatOptions): string {
  if (!date) return ""
  return date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", ...opts })
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return new NextResponse("slug required", { status: 400 })

  const funeral = await prisma.funeral.findUnique({ where: { slug } })
  if (!funeral) return new NextResponse("not found", { status: 404 })

  let font: Buffer
  try {
    font = getFont()
  } catch {
    return new NextResponse("font not found", { status: 500 })
  }

  const birthYear = funeral.birthDate
    ? fmt(funeral.birthDate, { year: "numeric" })
    : null
  const deathYear = fmt(funeral.deathDate, { year: "numeric" })
  const lifespan = birthYear ? `${birthYear} – ${deathYear}` : deathYear

  const processionStr = funeral.processionAt
    ? fmt(funeral.processionAt, {
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null

  const hallStr = funeral.funeralHall ? ` ${funeral.funeralHall}` : ""

  const svg = await satori(
    <div
      style={{
        width: "800px",
        height: "1120px",
        backgroundColor: "#111111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
        fontFamily: "NotoSansKR",
        position: "relative",
      }}
    >
      {/* 상단 장식선 */}
      <div
        style={{
          position: "absolute",
          top: "48px",
          left: "60px",
          right: "60px",
          height: "1px",
          backgroundColor: "#3a3a3a",
        }}
      />

      {/* 부고 라벨 */}
      <div
        style={{
          color: "#888888",
          fontSize: "22px",
          letterSpacing: "0.3em",
          marginBottom: "48px",
        }}
      >
        부 고
      </div>

      {/* 고인명 */}
      <div
        style={{
          color: "#f5f0e8",
          fontSize: "72px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "0.05em",
        }}
      >
        {funeral.deceasedName}
      </div>

      {/* 생몰년도 + 향년 */}
      <div
        style={{
          color: "#aaaaaa",
          fontSize: "24px",
          marginBottom: funeral.ageText ? "8px" : "48px",
        }}
      >
        {lifespan}
      </div>
      {funeral.ageText && (
        <div
          style={{
            color: "#777777",
            fontSize: "20px",
            marginBottom: "48px",
          }}
        >
          {funeral.ageText}
        </div>
      )}

      {/* 구분선 */}
      <div
        style={{
          width: "40px",
          height: "1px",
          backgroundColor: "#c9a96e",
          marginBottom: "48px",
        }}
      />

      {/* 일정 정보 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginBottom: "48px",
        }}
      >
        {processionStr && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#888888", fontSize: "16px", letterSpacing: "0.1em" }}>발 인</span>
            <span style={{ color: "#dddddd", fontSize: "26px" }}>{processionStr}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#888888", fontSize: "16px", letterSpacing: "0.1em" }}>장례식장</span>
          <span style={{ color: "#dddddd", fontSize: "24px" }}>
            {funeral.funeralHome}{hallStr}
          </span>
          <span style={{ color: "#777777", fontSize: "18px" }}>{funeral.funeralAddress}</span>
        </div>
      </div>

      {/* 구분선 */}
      <div
        style={{
          width: "40px",
          height: "1px",
          backgroundColor: "#3a3a3a",
          marginBottom: "40px",
        }}
      />

      {/* 상주 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#888888", fontSize: "16px", letterSpacing: "0.1em" }}>상 주</span>
        <span style={{ color: "#bbbbbb", fontSize: "22px" }}>{funeral.chiefMourner}</span>
      </div>

      {/* 하단 장식선 */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: "60px",
          right: "60px",
          height: "1px",
          backgroundColor: "#3a3a3a",
        }}
      />
    </div>,
    {
      width: 800,
      height: 1120,
      fonts: [
        {
          name: "NotoSansKR",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  )

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 800 } })
  const pngData = resvg.render().asPng()

  return new Response(pngData.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="funeral-${slug}.png"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
