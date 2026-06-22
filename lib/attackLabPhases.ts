import type { Mission } from "@/types/mission";

export const ATTACK_LAB_TYPES = [
  "RECON",
  "OSINT",
  "WEB_ATTACK",
  "EXPLOITATION",
  "PASSWORD_ATTACK"
] as const;

export type AttackLabMissionType = (typeof ATTACK_LAB_TYPES)[number];

export const ATTACK_LAB_PHASES = [
  {
    id: "reconnaissance",
    title: "Reconnaissance",
    subtitle: "Map the target surface before engagement.",
    types: ["RECON", "OSINT"] as const,
    challenges: [
      "Nmap Simulator",
      "Service Enumeration",
      "Banner Grabbing",
      "OSINT Investigation",
      "TheHarvester Simulation"
    ]
  },
  {
    id: "web-exploitation",
    title: "Web Exploitation",
    subtitle: "Break web apps through classic OWASP flaws.",
    types: ["WEB_ATTACK"] as const,
    challenges: [
      "SQL Injection",
      "XSS",
      "Authentication Bypass",
      "IDOR",
      "Broken Access Control",
      "File Upload Vulnerability",
      "Directory Enumeration",
      "Cookie Security",
      "JWT Analysis"
    ]
  },
  {
    id: "exploitation",
    title: "Exploitation",
    subtitle: "Match vulnerabilities to exploits and payloads.",
    types: ["EXPLOITATION"] as const,
    challenges: [
      "CVE Investigation",
      "Metasploit Simulator",
      "Exploit Matching",
      "Payload Selection",
      "Vulnerability Analysis"
    ]
  },
  {
    id: "password-security",
    title: "Password Security",
    subtitle: "Crack, spray, and audit authentication weaknesses.",
    types: ["PASSWORD_ATTACK"] as const,
    challenges: [
      "Hash Identifier",
      "John The Ripper Challenge",
      "Hashcat Challenge",
      "Hydra Login Investigation"
    ]
  }
] as const;

export type AttackLabPhase = (typeof ATTACK_LAB_PHASES)[number];

export function isAttackLabMission(mission: Mission): boolean {
  return (ATTACK_LAB_TYPES as readonly string[]).includes(mission.type);
}

export function getPhaseMissions(phase: AttackLabPhase, missions: Mission[]): Mission[] {
  const types = new Set<string>(phase.types);
  return missions.filter(mission => types.has(mission.type));
}

export function getDifficultySpread(missions: Mission[]) {
  const spread = { Beginner: 0, Intermediate: 0, Advanced: 0 };

  for (const mission of missions) {
    const value = mission.difficulty.toLowerCase();
    if (value.includes("beginner") || value === "easy") {
      spread.Beginner += 1;
    } else if (value.includes("intermediate") || value === "medium") {
      spread.Intermediate += 1;
    } else if (value.includes("advanced") || value === "hard") {
      spread.Advanced += 1;
    }
  }

  return spread;
}

export function getAttackLabXp(missions: Mission[], completedIds: Set<number>): number {
  return missions
    .filter(mission => completedIds.has(mission.id))
    .reduce((total, mission) => total + mission.xp, 0);
}
