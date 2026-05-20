import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import GuestbookAdminClient from "./GuestbookAdminClient"

export default async function GuestbookAdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const pending = await prisma.guestbook.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: { funeral: { select: { deceasedName: true, slug: true } } },
  })

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          방명록 승인 대기
        </h1>

        {pending.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>승인 대기 중인 방명록이 없습니다.</p>
        ) : (
          <GuestbookAdminClient initialItems={pending.map((g) => ({
            id: g.id,
            authorName: g.authorName,
            message: g.message,
            createdAt: g.createdAt.toISOString(),
            deceasedName: g.funeral.deceasedName,
            slug: g.funeral.slug,
          }))} />
        )}
      </div>
    </div>
  )
}
