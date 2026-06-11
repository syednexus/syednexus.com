-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "recoveryEmail" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "recoveryKeyHash" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "resetExpires" DATETIME;
ALTER TABLE "AdminUser" ADD COLUMN "resetTokenHash" TEXT;
