import type { SecurityEventType } from "@/lib/security/securityEvents";

export type MitreCategory =
  | "Credential Access"
  | "Privilege Escalation"
  | "Initial Access"
  | "Discovery"
  | "Impact"
  | "Other";

export type MitreBreakdownEntry = {
  category: MitreCategory;
  technique: string;
  count: number;
  percentage: number;
};

const EVENT_TO_MITRE: Partial<
  Record<SecurityEventType | string, { category: MitreCategory; technique: string }>
> = {
  LOGIN_FAILED: { category: "Credential Access", technique: "T1110 Brute Force" },
  MFA_FAILED: { category: "Credential Access", technique: "T1110 Brute Force" },
  RECOVERY_USED: { category: "Credential Access", technique: "T1098 Account Manipulation" },
  API_FORBIDDEN: { category: "Privilege Escalation", technique: "T1078 Valid Accounts" },
  SUDO_ATTEMPT: { category: "Privilege Escalation", technique: "T1548 Abuse Elevation Control" },
  OWNER_ACCESS_DENIED: { category: "Privilege Escalation", technique: "T1078 Valid Accounts" },
  FILE_UPLOAD: { category: "Initial Access", technique: "T1190 Exploit Public-Facing Application" },
  RATE_LIMIT_TRIGGERED: { category: "Discovery", technique: "T1046 Network Service Discovery" },
  SECURITY_SCAN: { category: "Discovery", technique: "T1595 Active Scanning" },
  THREAT_THRESHOLD: { category: "Impact", technique: "T1498 Network Denial of Service" },
  THREAT_THRESHOLD_REACHED: { category: "Impact", technique: "T1498 Network Denial of Service" }
};

export function mapEventToMitre(eventType: string): {
  category: MitreCategory;
  technique: string;
} {
  return (
    EVENT_TO_MITRE[eventType] ?? {
      category: "Other",
      technique: "Unmapped activity"
    }
  );
}

export function buildMitreBreakdown(
  events: Array<{ eventType: string }>
): MitreBreakdownEntry[] {
  const counts = new Map<string, { category: MitreCategory; technique: string; count: number }>();

  for (const event of events) {
    const mapped = mapEventToMitre(event.eventType);
    const key = `${mapped.category}::${mapped.technique}`;
    const current = counts.get(key) ?? { ...mapped, count: 0 };
    current.count += 1;
    counts.set(key, current);
  }

  const total = events.length || 1;

  return [...counts.values()]
    .map(entry => ({
      category: entry.category,
      technique: entry.technique,
      count: entry.count,
      percentage: Math.round((entry.count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}
