/**
 * Purge SecurityLog rows older than SECURITY_LOG_RETENTION_DAYS (default 90).
 * Run via cron: npm run security:purge-logs
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const retentionDays = Number(process.env.SECURITY_LOG_RETENTION_DAYS ?? "90");
const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

try {
  const result = await prisma.securityLog.deleteMany({
    where: { createdAt: { lt: cutoff } }
  });
  console.log(
    `[purge-security-logs] Deleted ${result.count} rows older than ${retentionDays} days (before ${cutoff.toISOString()})`
  );
} finally {
  await prisma.$disconnect();
}
