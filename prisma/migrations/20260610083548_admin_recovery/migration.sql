-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "recoveryEmail" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "recoveryKeyHash" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "resetExpires" TIMESTAMP(3);
ALTER TABLE "AdminUser" ADD COLUMN "resetTokenHash" TEXT;
