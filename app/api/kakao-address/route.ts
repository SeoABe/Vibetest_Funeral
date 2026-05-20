import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { searchKakaoAddress } from "@/lib/kakao-address"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const query = req.nextUrl.searchParams.get("q")
  if (!query) return NextResponse.json([])

  try {
    const results = await searchKakaoAddress(query)
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: "주소 검색에 실패했습니다." }, { status: 500 })
  }
}
