export type NexusRank = {
  title: string;
  tier: number;
  minXp: number;
  nextXp: number | null;
};

const RANK_THRESHOLDS: { minXp: number; title: string }[] = [
  { minXp: 0, title: "Initiate" },
  { minXp: 100, title: "Operator" },
  { minXp: 300, title: "Analyst" },
  { minXp: 600, title: "Specialist" },
  { minXp: 1000, title: "Architect" },
  { minXp: 1500, title: "Nexus Elite" },
];

export function getRankFromXp(xp: number): NexusRank {
  let tier = 0;

  for (let index = RANK_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    if (xp >= RANK_THRESHOLDS[index].minXp) {
      tier = index;
      break;
    }
  }

  const current = RANK_THRESHOLDS[tier];
  const next = RANK_THRESHOLDS[tier + 1] ?? null;

  return {
    title: current.title,
    tier,
    minXp: current.minXp,
    nextXp: next?.minXp ?? null,
  };
}
