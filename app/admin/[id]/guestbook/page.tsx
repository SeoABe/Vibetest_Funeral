import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import GuestbookAdminClient from "@/app/admin/guestbook/GuestbookAdminClient"

type Props = { params: Promise<{ id: string }> }

export default async function FuneralGuestbookPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params
  const funeral = await prisma.funeral.findUnique({
    where: { id },
    select: { deceasedName: true, slug: true },
  })
  if (!funeral) notFound()

  const pending = await prisma.guestbook.findMany({
    where: { funeralId: id, status: "pending" },
    orderBy: { createdAt: "asc" },
  })

  const approved = await prisma.guestbook.findMany({
    where: { funeralId: id, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 30,
  })

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/dashboard"
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            ← 대시보드
          </Link>
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
          >
            {funeral.deceasedName} 님 · 방명록 관리
          </h1>
        </div>

        {pending.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              승인 대기 ({pending.length})
            </h2>
            <GuestbookAdminClient initialItems={pending.map((g) => ({
              id: g.id,
              authorName: g.authorName,
              message: g.message,
              createdAt: g.createdAt.toISOString(),
              deceasedName: funeral.deceasedName,
              slug: funeral.slug,
            }))} />
          </section>
        )}

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            승인된 방명록 ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>아직 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {approved.map((g) => (
                <li
                  key={g.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {g.authorName}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(g.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {g.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
