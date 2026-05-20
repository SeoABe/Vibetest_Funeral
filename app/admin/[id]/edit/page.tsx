import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import FuneralForm from "@/components/admin/FuneralForm"
import type { FuneralFormData, FamilyMember, Account } from "@/components/admin/FuneralForm/types"

function toDateStr(d: Date | null | undefined): string {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 16)
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params
  const funeral = await prisma.funeral.findUnique({ where: { id } })
  if (!funeral) notFound()

  const visitation = funeral.visitation as { startsAt?: string; endsAt?: string; note?: string } | null

  const initialData: Partial<FuneralFormData> = {
    deceasedName: funeral.deceasedName,
    deceasedPhoto: funeral.deceasedPhoto ?? "",
    birthDate: toDateStr(funeral.birthDate),
    deathDate: toDateStr(funeral.deathDate),
    ageText: funeral.ageText ?? "",
    obituaryText: funeral.obituaryText ?? "",
    chiefMourner: funeral.chiefMourner,
    familyList: (funeral.familyList as unknown as FamilyMember[]) ?? [],
    shroudingAt: toDateStr(funeral.shroudingAt),
    visitationStartsAt: visitation?.startsAt ? new Date(visitation.startsAt).toISOString().slice(0, 16) : "",
    visitationEndsAt: visitation?.endsAt ? new Date(visitation.endsAt).toISOString().slice(0, 16) : "",
    visitationNote: visitation?.note ?? "",
    processionAt: toDateStr(funeral.processionAt),
    burialPlace: funeral.burialPlace ?? "",
    funeralHome: funeral.funeralHome,
    funeralHall: funeral.funeralHall ?? "",
    funeralAddress: funeral.funeralAddress,
    funeralLat: funeral.funeralLat,
    funeralLng: funeral.funeralLng,
    accounts: (funeral.accounts as unknown as Account[]) ?? [],
    guestbookRequiresApproval: funeral.guestbookRequiresApproval,
    guestbookMaxLength: funeral.guestbookMaxLength,
    guestbookAllowAnonymous: funeral.guestbookAllowAnonymous,
    isPublished: funeral.isPublished,
    expiresAt: toDateStr(funeral.expiresAt),
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          부고 수정 — {funeral.deceasedName}
        </h1>
        <div className="flex gap-2">
          <a
            href={`/${funeral.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-sm min-h-[44px] flex items-center"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            공개 페이지 ↗
          </a>
          <a
            href={`/api/share/print?slug=${funeral.slug}`}
            download={`funeral-${funeral.slug}.png`}
            className="px-3 py-2 rounded-lg text-sm min-h-[44px] flex items-center"
            style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            인쇄용 이미지
          </a>
        </div>
      </div>
      <FuneralForm initialData={initialData} funeralId={id} />
    </div>
  )
}
