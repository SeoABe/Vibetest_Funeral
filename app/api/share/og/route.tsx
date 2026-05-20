import React from "react"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"

function fmt(date: Date | null | undefined): string {
  if (!date) return ""
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

let cachedFont: Buffer | null = null
function getFont(): Buffer {
  if (!cachedFont) {
    cachedFont = readFileSync(join(process.cwd(), "public", "fonts", "NotoSansKR-Medium.ttf"))
  }
  return cachedFont
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return new NextResponse("slug required", { status: 400 })

  const funeral = await prisma.funeral.findUnique({ where: { slug } })
  if (!funeral) return new NextResponse("not found", { status: 404 })

  const processionStr = funeral.processionAt ? fmt(funeral.processionAt) : ""
  const hallStr = funeral.funeralHall ? ` ${funeral.funeralHall}` : ""

  let font: Buffer
  try {
    font = getFont()
  } catch {
    return new NextResponse("font not found", { status: 500 })
  }

  const svg = await satori(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#111111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "NotoSansKR",
        position: "relative",
      }}
    >
      <div style={{ color: "#888888", fontSize: "24px", letterSpacing: "0.1em", marginBottom: "32px" }}>
        부고
      </div>

      <div style={{ color: "#f5f0e8", fontSize: "80px", fontWeight: 600, marginBottom: "24px" }}>
        {funeral.deceasedName} 님
      </div>

      <div style={{ color: "#aaaaaa", fontSize: "32px", marginBottom: "16px" }}>
        {funeral.funeralHome}{hallStr}
      </div>

      {processionStr && (
        <div style={{ color: "#777777", fontSize: "28px" }}>
          발인 {processionStr}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "48px",
          right: "80px",
          color: "#444444",
          fontSize: "22px",
        }}
      >
        디지털 부고
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
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

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
  const pngData = resvg.render().asPng()

  return new Response(pngData.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
