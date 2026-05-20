import { notFound } from "next/navigation"
import { Metadata } from "next"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import HeroSection from "@/components/funeral/HeroSection"
import FamilyList from "@/components/funeral/FamilyList"
import FuneralSchedule from "@/components/funeral/FuneralSchedule"
import LocationMap from "@/components/funeral/LocationMapWrapper"
import AccountInfo from "@/components/funeral/AccountInfo"
import StickyActionBar from "@/components/funeral/StickyActionBar"
import ShareSection from "@/components/share/ShareSection"
import GuestbookSection from "@/components/funeral/GuestbookSection"
import PrivateMessageSection from "@/components/funeral/PrivateMessageSection"
import DeceasedLetterSection from "@/components/funeral/DeceasedLetterSection"
import FictionalNoticeModal from "@/components/funeral/FictionalNoticeModal"

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

function normalizeDeceasedPhoto(photo: string | null) {
  return photo
    ?.replace("/mock-assets/images/deceased-kim-haru.svg", "/mock-assets/images/deceased-kim-haru.png")
    .replace("/mock-assets/images/deceased-lee-jungmin.svg", "/mock-assets/images/deceased-lee-jungmin.png") ?? null
}

async function getBaseUrl() {
  const hdrs = await headers()
  const host = hdrs.get("host") ?? "localhost:3000"
  const proto = hdrs.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const funeral = await prisma.funeral.findUnique({ where: { slug: id } })
  if (!funeral) return { title: "부고" }

  const processionStr = funeral.processionAt
    ? new Date(funeral.processionAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
    : ""

  const base = await getBaseUrl()
  const ogImageUrl = `${base}/api/share/og?slug=${id}`

  return {
    title: `${funeral.deceasedName} 님의 부고`,
    description:
      funeral.obituaryText ??
      `${funeral.funeralHome}${processionStr ? ` · 발인 ${processionStr}` : ""}`,
    openGraph: {
      title: `${funeral.deceasedName} 님의 부고`,
      description: `${funeral.funeralHome}${funeral.funeralHall ? ` ${funeral.funeralHall}` : ""}${processionStr ? ` · 발인 ${processionStr}` : ""}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
  }
}

export default async function FuneralPage({ params }: Props) {
  const { id } = await params
  const funeral = await prisma.funeral.findUnique({ where: { slug: id } })

  if (!funeral || !funeral.isPublished) notFound()

  const rawGuestbook = await prisma.guestbook.findMany({
    where: { funeralId: funeral.id, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 11,
    select: { id: true, authorName: true, message: true, createdAt: true },
  })
  const hasMore = rawGuestbook.length > 10
  const guestbookItems = hasMore ? rawGuestbook.slice(0, 10) : rawGuestbook
  const initialGuestbook = {
    items: guestbookItems.map((g) => ({ ...g, createdAt: g.createdAt.toISOString() })),
    nextCursor: hasMore ? guestbookItems[guestbookItems.length - 1].id : null,
  }

  const accounts = funeral.accounts as {
    id: string; bank: string; holder: string; number: string
    relation: string; displayMode: "tapToReveal" | "visible"
  }[]
  const familyList = funeral.familyList as { relation: string; name: string }[]
  const visitation = funeral.visitation as {
    startsAt?: string; endsAt?: string; note?: string
  } | null
  const deceasedPhoto = normalizeDeceasedPhoto(funeral.deceasedPhoto)

  return (
    <div className="memorial-page pb-24">
      <FictionalNoticeModal />

      <HeroSection
        name={funeral.deceasedName}
        photo={deceasedPhoto}
        birthDate={funeral.birthDate}
        deathDate={funeral.deathDate}
        ageText={funeral.ageText}
        chiefMourner={funeral.chiefMourner}
        funeralHome={funeral.funeralHome}
        funeralHall={funeral.funeralHall}
        processionAt={funeral.processionAt}
      />

      {funeral.obituaryText && (
        <section className="memorial-section px-5 py-6">
          <p
            className="text-base leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {funeral.obituaryText}
          </p>
        </section>
      )}

      <FamilyList familyList={familyList} chiefMourner={funeral.chiefMourner} />

      <FuneralSchedule
        shroudingAt={funeral.shroudingAt}
        visitation={visitation}
        processionAt={funeral.processionAt}
        burialPlace={funeral.burialPlace}
      />

      <LocationMap
        lat={funeral.funeralLat}
        lng={funeral.funeralLng}
        funeralHome={funeral.funeralHome}
        funeralHall={funeral.funeralHall}
        funeralAddress={funeral.funeralAddress}
      />

      <AccountInfo accounts={accounts} />

      <ShareSection
        title={`${funeral.deceasedName} 님의 부고`}
        description={`${funeral.funeralHome}${funeral.funeralHall ? ` ${funeral.funeralHall}` : ""}${funeral.processionAt ? ` · 발인 ${new Date(funeral.processionAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}` : ""}`}
        funeralSlug={funeral.slug}
        deceasedPhoto={deceasedPhoto}
      />

      {funeral.privateMessageContent && (
        <PrivateMessageSection
          funeralId={funeral.id}
          label={funeral.privateMessageLabel ?? "가족에게 남긴 글"}
        />
      )}

      {funeral.deceasedLetter && (
        <DeceasedLetterSection
          name={funeral.deceasedName}
          letter={funeral.deceasedLetter}
        />
      )}

      <GuestbookSection
        funeralId={funeral.id}
        initialItems={initialGuestbook.items}
        initialNextCursor={initialGuestbook.nextCursor}
        requiresApproval={funeral.guestbookRequiresApproval}
        maxLength={funeral.guestbookMaxLength}
      />

      <StickyActionBar
        funeralAddress={funeral.funeralAddress}
        lat={funeral.funeralLat}
        lng={funeral.funeralLng}
      />
    </div>
  )
}
