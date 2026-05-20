import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const [funerals, totalPending] = await Promise.all([
    prisma.funeral.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            guestbook: { where: { status: "pending" } },
          },
        },
      },
    }),
    prisma.guestbook.count({ where: { status: "pending" } }),
  ])

  const publishedCount = funerals.filter((f) => f.isPublished).length

  return (
    <div>
      {/* 통계 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "전체 부고", value: funerals.length },
          { label: "공개 중", value: publishedCount },
          { label: "방명록 대기", value: totalPending },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>
              {value}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* 액션 헤더 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          부고 목록
        </h1>
        <div className="flex gap-2">
          {totalPending > 0 && (
            <Link
              href="/admin/guestbook"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center gap-1"
              style={{ backgroundColor: "#3a1a1a", color: "#e57373", border: "1px solid #5a2a2a" }}
            >
              방명록 승인 대기 {totalPending}
            </Link>
          )}
          <Link
            href="/admin/create"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center"
            style={{ backgroundColor: "var(--accent)", color: "#1a1a1a" }}
          >
            + 새 부고 작성
          </Link>
        </div>
      </div>

      {funerals.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
        >
          등록된 부고가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {funerals.map((f) => (
            <div
              key={f.id}
              className="rounded-xl p-5 flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-semibold text-lg truncate" style={{ color: "var(--text-primary)" }}>
                  {f.deceasedName}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: f.isPublished ? "#1a3a1a" : "var(--bg-elevated)",
                      color: f.isPublished ? "#6fcf6f" : "var(--text-muted)",
                    }}
                  >
                    {f.isPublished ? "공개" : "비공개"}
                  </span>
                  {f._count.guestbook > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#3a1a1a", color: "#e57373" }}
                    >
                      승인 대기 {f._count.guestbook}
                    </span>
                  )}
                  {f.expiresAt && new Date(f.expiresAt) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#2a2a1a", color: "#c9a96e" }}
                    >
                      만료 임박
                    </span>
                  )}
                </div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {f.funeralHome}
                  {f.funeralHall && ` · ${f.funeralHall}`}
                  {f.processionAt && (
                    <> · 발인 {new Date(f.processionAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}</>
                  )}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  /{f.slug}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/${f.slug}`}
                  target="_blank"
                  className="text-sm px-3 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                  style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  보기
                </Link>
                <Link
                  href={`/admin/${f.id}/guestbook`}
                  className="text-sm px-3 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                  style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  방명록
                </Link>
                <Link
                  href={`/admin/${f.id}/edit`}
                  className="text-sm px-3 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                >
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
