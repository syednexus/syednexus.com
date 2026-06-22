import "dotenv/config";

import { prisma } from "../../lib/prisma";
import { seedAttackLabPack001 } from "./attackLabPack001";
import { seedCyberRangePack001 } from "./cyberRangePack001";
import { seedGamePack001 } from "./gamePack001";
import { seedPracticalPack001 } from "./practicalPack001";

async function main() {
  if (process.env.ALLOW_DB_SEED !== "true") {
    throw new Error("Database seed blocked. Set ALLOW_DB_SEED=true to continue.");
  }

  console.log("Seeding Nexus mission packs...");

  await seedAttackLabPack001();
  await seedCyberRangePack001();
  await seedGamePack001();
  await seedPracticalPack001();

  console.log("All mission packs seeded (attack, cyber range, games, practical).");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
