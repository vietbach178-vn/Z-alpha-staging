-- CreateEnum
CREATE TYPE "AttachmentLanguage" AS ENUM ('VI', 'EN', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactAudience" AS ENUM ('STUDENT', 'SCHOOL', 'GOVERNMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LibraryCategory" AS ENUM ('BOOK', 'REPORT', 'REFERENCE');

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "audience" "ContactAudience" NOT NULL DEFAULT 'OTHER',
    "message" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT,
    "descriptionVi" TEXT,
    "descriptionEn" TEXT,
    "thumbnailUrl" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileMime" TEXT,
    "category" "LibraryCategory" NOT NULL DEFAULT 'REPORT',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitleVi" TEXT,
    "seoTitleEn" TEXT,
    "seoDescVi" TEXT,
    "seoDescEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchAttachment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileMime" TEXT,
    "language" "AttachmentLanguage" NOT NULL DEFAULT 'VI',
    "labelVi" TEXT,
    "labelEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryItem_slug_key" ON "LibraryItem"("slug");

-- CreateIndex
CREATE INDEX "LibraryItem_category_idx" ON "LibraryItem"("category");

-- CreateIndex
CREATE INDEX "LibraryItem_status_publishedAt_idx" ON "LibraryItem"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "ResearchAttachment_articleId_order_idx" ON "ResearchAttachment"("articleId", "order");

-- AddForeignKey
ALTER TABLE "ResearchAttachment" ADD CONSTRAINT "ResearchAttachment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ResearchArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
