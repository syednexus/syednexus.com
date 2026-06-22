-- AlterTable
ALTER TABLE "Mission" ADD COLUMN "hints" TEXT[] DEFAULT ARRAY[]::TEXT[];
