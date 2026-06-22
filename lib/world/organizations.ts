import type { PublicMission } from "@/types/PublicMission";

import { parseWorldMissionMeta } from "@/lib/world/worldConfig";

export type OrganizationId =
  | "nexus-security"
  | "blueforge-bank"
  | "healthcore"
  | "cybergov"
  | "retailcorp";

export type Organization = {
  id: OrganizationId;
  name: string;
  sector: string;
  tagline: string;
  contractUnlockReputation: number;
  color: string;
};

export const ORGANIZATIONS: Record<OrganizationId, Organization> = {
  "nexus-security": {
    id: "nexus-security",
    name: "Nexus Security",
    sector: "MSSP",
    tagline: "Managed detection and incident response for enterprise clients.",
    contractUnlockReputation: 40,
    color: "#22c55e"
  },
  "blueforge-bank": {
    id: "blueforge-bank",
    name: "BlueForge Bank",
    sector: "Financial Services",
    tagline: "Retail banking under constant fraud and APT pressure.",
    contractUnlockReputation: 55,
    color: "#3b82f6"
  },
  healthcore: {
    id: "healthcore",
    name: "HealthCore",
    sector: "Healthcare",
    tagline: "HIPAA-regulated hospital network and medical IoT exposure.",
    contractUnlockReputation: 50,
    color: "#14b8a6"
  },
  cybergov: {
    id: "cybergov",
    name: "CyberGov",
    sector: "Public Sector",
    tagline: "Federal agency SOC with nation-state threat actors.",
    contractUnlockReputation: 65,
    color: "#a855f7"
  },
  retailcorp: {
    id: "retailcorp",
    name: "RetailCorp",
    sector: "Retail / E-commerce",
    tagline: "High-volume POS, web storefront, and supply-chain risk.",
    contractUnlockReputation: 45,
    color: "#f97316"
  }
};

const CATEGORY_ORG_MAP: Record<string, OrganizationId> = {
  General: "nexus-security",
  Cryptography: "cybergov",
  NetworkSecurity: "blueforge-bank",
  Forensics: "healthcore",
  WebSecurity: "retailcorp",
  SOC: "nexus-security",
  Career: "nexus-security"
};

export type ReputationTier = "trusted" | "neutral" | "suspicious";

export function resolveOrganizationId(mission: PublicMission): OrganizationId {
  const meta = parseWorldMissionMeta(mission);
  if (meta.organizationId) return meta.organizationId;
  return CATEGORY_ORG_MAP[mission.category] ?? "nexus-security";
}

export function getOrganization(mission: PublicMission): Organization {
  return ORGANIZATIONS[resolveOrganizationId(mission)];
}

/** Reputation 0–100 derived from existing XP — no duplicate progression currency. */
export function computeReputation(xp: number, completedMissions: number): number {
  const raw = Math.round(xp / 40 + completedMissions * 3);
  return Math.max(0, Math.min(100, raw));
}

export function getReputationTier(reputation: number): ReputationTier {
  if (reputation >= 70) return "trusted";
  if (reputation >= 35) return "neutral";
  return "suspicious";
}

export function canUnlockContract(org: Organization, reputation: number): boolean {
  return reputation >= org.contractUnlockReputation;
}

export function getDifficultyModifier(reputation: number): "standard" | "elevated" | "critical" {
  if (reputation >= 70) return "standard";
  if (reputation >= 35) return "elevated";
  return "critical";
}

export function reputationLabel(tier: ReputationTier): string {
  const labels: Record<ReputationTier, string> = {
    trusted: "Trusted Contractor",
    neutral: "Standard Clearance",
    suspicious: "Probationary Access"
  };
  return labels[tier];
}
