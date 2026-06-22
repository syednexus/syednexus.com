import { prisma } from "../../../lib/prisma";

/**
 * Run a seed function only when the file is executed directly (tsx prisma/seed/foo.ts),
 * not when imported by runMissionPacks.ts or other orchestrators.
 */
export function runSeedIfMain(moduleSegment: string, seed: () => Promise<void>) {
  const entry = process.argv[1]?.replace(/\\/g, "/") ?? "";

  if (!entry.includes(moduleSegment)) {
    return;
  }

  seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
