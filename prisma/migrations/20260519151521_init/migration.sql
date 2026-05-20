-- CreateTable
CREATE TABLE "Funeral" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "deceasedPhoto" TEXT,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3) NOT NULL,
    "ageText" TEXT,
    "chiefMourner" TEXT NOT NULL,
    "familyList" JSONB NOT NULL,
    "obituaryText" TEXT,
    "funeralHome" TEXT NOT NULL,
    "funeralHall" TEXT,
    "funeralAddress" TEXT NOT NULL,
    "funeralLat" DOUBLE PRECISION NOT NULL,
    "funeralLng" DOUBLE PRECISION NOT NULL,
    "shroudingAt" TIMESTAMP(3),
    "visitation" JSONB,
    "processionAt" TIMESTAMP(3),
    "burialPlace" TEXT,
    "accounts" JSONB NOT NULL,
    "guestbookRequiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "guestbookMaxLength" INTEGER NOT NULL DEFAULT 300,
    "guestbookAllowAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "privateMessageContent" TEXT,
    "privateMessagePassword" TEXT,
    "privateMessageLabel" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Funeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guestbook" (
    "id" TEXT NOT NULL,
    "funeralId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guestbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funeral_slug_key" ON "Funeral"("slug");

-- CreateIndex
CREATE INDEX "Guestbook_funeralId_status_idx" ON "Guestbook"("funeralId", "status");

-- AddForeignKey
ALTER TABLE "Guestbook" ADD CONSTRAINT "Guestbook_funeralId_fkey" FOREIGN KEY ("funeralId") REFERENCES "Funeral"("id") ON DELETE CASCADE ON UPDATE CASCADE;
