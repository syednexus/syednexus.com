import type { SaveSlotId } from "@/lib/world/types";

export const CREDIT_COSTS = {
  hint: 15,
  vmUpgrade: 40,
  theme: 25,
  privateLab: 80,
  mentorExplain: 10
} as const;

export const CREDIT_REWARDS = {
  missionComplete: 20,
  taskMilestone: 5,
  careerDayClear: 12
} as const;

export function missionCreditReward(difficulty: string): number {
  const map: Record<string, number> = {
    easy: 15,
    beginner: 15,
    medium: 20,
    hard: 30,
    expert: 40
  };
  return map[difficulty.toLowerCase()] ?? CREDIT_REWARDS.missionComplete;
}

export function canAfford(credits: number, cost: number): boolean {
  return credits >= cost;
}

export function spendCredits(credits: number, cost: number): number {
  return Math.max(0, credits - cost);
}

export function addCredits(credits: number, amount: number): number {
  return credits + amount;
}

export function formatCredits(value: number): string {
  return `${value} CR`;
}

export type CreditSpendReason = keyof typeof CREDIT_COSTS;

export function slotCreditsKey(slot: SaveSlotId): string {
  return `nexus_v36_credits_${slot}`;
}
