import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import { encrypt } from "../lib/crypto"
import funerals from "../fixtures/data/funerals.seed.json"
import guestbook from "../fixtures/data/guestbook.seed.json"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // 기존 데이터 정리
  await prisma.guestbook.deleteMany()
  await prisma.funeral.deleteMany()

  // 부고 데이터 삽입
  for (const f of funerals) {
    await prisma.funeral.create({
      data: {
        id: f.id,
        slug: f.slug,
        deceasedName: f.deceasedName,
        deceasedPhoto: f.deceasedPhoto ?? null,
        birthDate: f.birthDate ? new Date(f.birthDate) : null,
        deathDate: new Date(f.deathDate),
        ageText: f.ageText ?? null,
        chiefMourner: f.chiefMourner,
        familyList: f.familyList,
        obituaryText: f.obituaryText ?? null,
        funeralHome: f.funeralHome,
        funeralHall: f.funeralHall ?? null,
        funeralAddress: f.funeralAddress,
        funeralLat: f.funeralLat,
        funeralLng: f.funeralLng,
        shroudingAt: f.shroudingAt ? new Date(f.shroudingAt) : null,
        visitation: f.visitation ?? undefined,
        processionAt: f.processionAt ? new Date(f.processionAt) : null,
        burialPlace: f.burialPlace ?? null,
        accounts: f.accounts,
        guestbookRequiresApproval: f.guestbookPolicy?.requiresApproval ?? true,
        guestbookMaxLength: f.guestbookPolicy?.maxMessageLength ?? 300,
        guestbookAllowAnonymous: f.guestbookPolicy?.allowAnonymous ?? true,
        deceasedLetter: (f as { deceasedLetter?: string }).deceasedLetter ?? null,
        privateMessageContent: f.privateMessage?.content
          ? encrypt(f.privateMessage.content)
          : null,
        privateMessagePassword: f.privateMessage?.plainPasswordForLocalTest
          ? await bcrypt.hash(f.privateMessage.plainPasswordForLocalTest, 12)
          : null,
        privateMessageLabel: f.privateMessage?.label ?? null,
        isPublished: f.isPublished,
        publishedAt: f.publishedAt ? new Date(f.publishedAt) : null,
        expiresAt: f.expiresAt ? new Date(f.expiresAt) : null,
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt),
      },
    })
    console.log(`  ✓ 부고 생성: ${f.deceasedName} (${f.slug})`)
  }

  // 방명록 데이터 삽입
  for (const g of guestbook) {
    await prisma.guestbook.create({
      data: {
        id: g.id,
        funeralId: g.funeralId,
        authorName: g.authorName,
        message: g.message,
        status: g.status === "delete_candidate" ? "pending" : (g.status ?? "pending"),
        isApproved: g.isApproved,
        approvedAt: "approvedAt" in g && g.approvedAt ? new Date(g.approvedAt as string) : null,
        createdAt: new Date(g.createdAt),
      },
    })
    console.log(`  ✓ 방명록: ${g.authorName} → ${g.funeralId}`)
  }

  console.log("✅ Seed 완료")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
