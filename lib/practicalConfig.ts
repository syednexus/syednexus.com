import type { PublicMission } from "@/types/PublicMission";
import { isGameMissionType } from "@/lib/gameTypes";
import { isLabMissionType } from "@/lib/labConfig";

export const SOC_MISSION_TYPES = [
  "SOC_ALERT",
  "SIEM",
  "PHISHING",
  "MALWARE",
  "THREAT_HUNT",
  "INCIDENT_RESPONSE",
  "NETWORK",
  "TERMINAL"
] as const;

export type SocMissionType = (typeof SOC_MISSION_TYPES)[number];

export const ATTACK_PRACTICAL_TYPES = [
  "RECON",
  "OSINT",
  "WEB_ATTACK",
  "EXPLOITATION",
  "PASSWORD_ATTACK"
] as const;

export const GAME_PRACTICAL_TYPES = [
  "LINUX_GAME",
  "COMMAND_CHALLENGE",
  "NETWORK_GAME",
  "PACKET_ANALYSIS",
  "QUIZ",
  "PORT_HUNTER"
] as const;

export const FORENSICS_PRACTICAL_TYPES = [
  "FORENSICS",
  "MEMORY_ANALYSIS",
  "FILE_RECOVERY"
] as const;

export const PRACTICAL_MISSION_TYPES = [
  ...ATTACK_PRACTICAL_TYPES,
  ...GAME_PRACTICAL_TYPES,
  ...FORENSICS_PRACTICAL_TYPES,
  "TOOL_SIMULATION",
  "CAREER_SCENARIO"
] as const;

export type PracticalModule =
  | "attack"
  | "games"
  | "forensics"
  | "tools"
  | "career";

export type ForensicsConfig = {
  mode?: "evidence" | "timeline" | "hash";
  artifacts?: Array<{ name: string; content: string }>;
  timeline?: Array<{ time: string; event: string; suspicious?: boolean }>;
  hash?: { file: string; md5: string; sha256?: string };
  objective?: string;
};

export type ToolConfig = {
  tool?: string;
  defaultCommand?: string;
  output?: string;
  explanation?: string;
};

export type CareerConfig = {
  mode?: "soc" | "pentest" | "interview";
  steps?: Array<{ time: string; title: string; detail: string; choices?: string[] }>;
  objective?: string;
};

export type PracticalConfig = {
  forensics?: ForensicsConfig;
  tool?: ToolConfig;
  career?: CareerConfig;
  objective?: string;
};

export function isSocMissionType(type: string): type is SocMissionType {
  return (SOC_MISSION_TYPES as readonly string[]).includes(type);
}

export function isPracticalMissionType(type: string): boolean {
  return (PRACTICAL_MISSION_TYPES as readonly string[]).includes(type);
}

export function resolvePracticalModule(type: string): PracticalModule {
  if (isLabMissionType(type)) return "attack";
  if (isGameMissionType(type)) return "games";
  if ((FORENSICS_PRACTICAL_TYPES as readonly string[]).includes(type)) return "forensics";
  if (type === "TOOL_SIMULATION") return "tools";
  return "career";
}

export function parsePracticalConfig(mission: PublicMission): PracticalConfig {
  if (!mission.content?.trim()) {
    return { objective: mission.description };
  }

  const raw = mission.content.trim();

  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as PracticalConfig;
    } catch {
      return { objective: raw };
    }
  }

  const marker = raw.indexOf("PRACTICAL_CONFIG:");
  if (marker >= 0) {
    try {
      const config = JSON.parse(raw.slice(marker + 17).trim()) as PracticalConfig;
      const brief = raw.slice(0, marker).trim();
      if (brief && !config.objective) {
        config.objective = brief.split("\n")[0]?.trim() || mission.description;
      }
      return config;
    } catch {
      return { objective: raw };
    }
  }

  return { objective: raw };
}

export function buildPracticalContent(brief: string, config: PracticalConfig): string {
  const json = JSON.stringify(config);
  return brief.trim() ? `${brief.trim()}\n\nPRACTICAL_CONFIG:${json}` : `PRACTICAL_CONFIG:${json}`;
}

export const PRACTICAL_PATHS: Record<
  PracticalModule,
  { step: number; title: string; subtitle: string }[]
> = {
  attack: [
    { step: 1, title: "Recon", subtitle: "Map the target surface" },
    { step: 2, title: "Enumeration", subtitle: "Discover services and paths" },
    { step: 3, title: "Exploitation", subtitle: "Exploit vulnerabilities safely" },
    { step: 4, title: "Privilege", subtitle: "Crack credentials and escalate" },
    { step: 5, title: "Report", subtitle: "Document findings" }
  ],
  games: [
    { step: 1, title: "Terminal", subtitle: "Linux command challenges" },
    { step: 2, title: "Filesystem", subtitle: "Hidden files and permissions" },
    { step: 3, title: "Network", subtitle: "Ports, DNS, and protocols" },
    { step: 4, title: "Packets", subtitle: "Traffic analysis puzzles" }
  ],
  forensics: [
    { step: 1, title: "Evidence", subtitle: "Collect and review artifacts" },
    { step: 2, title: "Timeline", subtitle: "Reconstruct event sequence" },
    { step: 3, title: "Hashes", subtitle: "Verify integrity" },
    { step: 4, title: "Report", subtitle: "Present forensic conclusions" }
  ],
  tools: [
    { step: 1, title: "Recon Tools", subtitle: "Nmap and scanners" },
    { step: 2, title: "Web Tools", subtitle: "Burp and proxies" },
    { step: 3, title: "Cracking", subtitle: "Hydra, John, Hashcat" },
    { step: 4, title: "Exploitation", subtitle: "Metasploit simulator" }
  ],
  career: [
    { step: 1, title: "Morning", subtitle: "Start the shift" },
    { step: 2, title: "Triage", subtitle: "Handle incoming work" },
    { step: 3, title: "Investigation", subtitle: "Deep-dive scenarios" },
    { step: 4, title: "Closeout", subtitle: "Report and handoff" }
  ]
};
