-- AlterTable
ALTER TABLE "Identity" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "Identity" ADD COLUMN "github" TEXT;
ALTER TABLE "Identity" ADD COLUMN "resume" TEXT;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "tags" TEXT;

-- CreateTable
CREATE TABLE "AiMemory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiMemory_pkey" PRIMARY KEY ("id")
);
