import { auth } from "@/auth"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // 로그인 페이지는 세션 체크 제외 (middleware가 처리)
  // layout은 /admin/* 전체에 적용되므로 로그인 페이지는 빈 래퍼만 반환
  if (!session?.user) {
    // middleware에서 이미 redirect 처리되므로 여기선 로그인 페이지 children만 렌더
    return <>{children}</>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#111" }}>
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        <Link
          href="/admin/dashboard"
          className="font-serif text-lg hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          부고 관리자
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {session.user.email}
          </span>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm px-3 py-1 rounded-md transition-colors min-h-[36px]"
              style={{
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  )
}
