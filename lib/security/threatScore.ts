import type { SecuritySeverity } from "@/lib/security/securityEvents";

export type ThreatScoreLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ThreatScoreInput = {
  severity: SecuritySeverity;
  eventType: string;
  createdAt: Date;
};

export type ThreatScoreResult = {
  score: number;
  level: ThreatScoreLevel;
  reasons: string[];
};

const SEVERITY_POINTS: Record<SecuritySeverity, number> = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 15,
  CRITICAL: 30
};

const WINDOW_MS = 24 * 60 * 60 * 1000;

function decayFactor(ageMs: number): number {
  if (ageMs >= WINDOW_MS) return 0;
  return 1 - ageMs / WINDOW_MS;
}

function scoreToLevel(score: number): ThreatScoreLevel {
  if (score >= 76) return "CRITICAL";
  if (score >= 51) return "HIGH";
  if (score >= 26) return "MEDIUM";
  return "LOW";
}

export function calculateThreatScore(
  events: ThreatScoreInput[],
  now = Date.now()
): ThreatScoreResult {
  const contributions = new Map<string, number>();

  let rawScore = 0;

  for (const event of events) {
    const ageMs = now - event.createdAt.getTime();
    if (ageMs < 0 || ageMs > WINDOW_MS) continue;

    const points = SEVERITY_POINTS[event.severity] * decayFactor(ageMs);
    if (points <= 0) continue;

    rawScore += points;
    contributions.set(event.eventType, (contributions.get(event.eventType) ?? 0) + points);
  }

  const score = Math.min(100, Math.round(rawScore));

  const reasons = [...contributions.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([eventType, points]) => `${eventType} (+${Math.round(points)})`);

  if (reasons.length === 0) {
    reasons.push("No significant events in the last 24 hours");
  }

  return {
    score,
    level: scoreToLevel(score),
    reasons
  };
}
