import type { Achievement } from "@/context/NexusContext";

export type AchievementTier = "standard" | "specialist";

const SPECIALIST_IDS = new Set([
  "nexus_master",
  "threat_hunter",
  "blue_team_analyst"
]);

const SPECIALIST_NAMES = new Set([
  "Threat Hunter",
  "Blue Team Analyst",
  "Nexus Master"
]);

export function getAchievementTier(achievement: Achievement): AchievementTier {
  const id = achievement.id.toLowerCase();
  const title = achievement.title.trim();

  if (SPECIALIST_IDS.has(id) || SPECIALIST_NAMES.has(title)) {
    return "specialist";
  }

  if (
    title.includes("Master") ||
    title.includes("Threat Hunter") ||
    title.includes("Blue Team")
  ) {
    return "specialist";
  }

  return "standard";
}

export function withAchievementTier(achievement: Achievement): Achievement {
  return {
    ...achievement,
    tier: achievement.tier ?? getAchievementTier(achievement)
  };
}

export function bootLinesForAchievement(achievement: Achievement): string[] {
  return [
    "> specialist clearance protocol initiated...",
    "> verifying analyst credentials...",
    `> loading ${achievement.title} module...`,
    `> ${achievement.description}`,
    `> ${achievement.icon} specialist access granted.`
  ];
}
