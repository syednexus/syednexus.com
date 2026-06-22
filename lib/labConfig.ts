import type { PublicMission } from "@/types/PublicMission";

export const LAB_MISSION_TYPES = [
  "RECON",
  "OSINT",
  "WEB_ATTACK",
  "PASSWORD_ATTACK",
  "EXPLOITATION"
] as const;

export type LabMissionType = (typeof LAB_MISSION_TYPES)[number];

export type WebLabMode =
  | "login"
  | "search"
  | "upload"
  | "idor"
  | "cookie"
  | "jwt"
  | "csrf"
  | "dirb"
  | "admin"
  | "analyze";

export type ExploitLabMode = "msf" | "cve" | "match" | "payload" | "report";

export type PasswordTool = "hydra" | "john" | "hashcat";

export type LabConfig = {
  target?: string;
  objective?: string;
  trigger?: string;
  commands?: Record<string, string>;
  reconTools?: string[];
  web?: {
    mode: WebLabMode;
    path?: string;
    placeholder?: string;
    hint?: string;
    successOutput?: string;
    acceptPatterns?: string[];
    dirListing?: string;
    cookieHeader?: string;
    jwtHeader?: string;
    jwtPayload?: string;
  };
  sqliSuccess?: string;
  xssSuccess?: string;
  uploadSuccess?: string;
  idorSuccess?: string;
  passwordTool?: PasswordTool;
  defaultCommand?: string;
  hydra?: {
    service: string;
    user: string;
    password: string;
    sprayOutput?: string;
  };
  hash?: {
    type: string;
    value: string;
    answer: string;
    identifyOutput?: string;
  };
  hashcat?: {
    mode: string;
    output: string;
  };
  exploitMode?: ExploitLabMode;
  msf?: {
    searchTerm: string;
    module: string;
    payload: string;
    rhost: string;
    successOutput: string;
  };
  cve?: {
    prompt: string;
    logSnippet: string;
    acceptPatterns?: string[];
  };
  exploitMatch?: {
    service: string;
    options: { id: string; label: string }[];
    correctId: string;
  };
  payloadSelect?: {
    scenario: string;
    options: { id: string; label: string }[];
    correctId: string;
  };
  reportFindings?: {
    items: { severity: string; text: string }[];
    criticalKeyword: string;
  };
};

export function isLabMissionType(type: string): type is LabMissionType {
  return (LAB_MISSION_TYPES as readonly string[]).includes(type);
}

export function buildLabContent(brief: string, config: LabConfig): string {
  const narrative = brief.trim();
  const json = JSON.stringify(config);
  return narrative ? `${narrative}\n\nLAB_CONFIG:${json}` : `LAB_CONFIG:${json}`;
}

export function parseLabConfig(mission: PublicMission): LabConfig {
  if (!mission.content?.trim()) {
    return { target: "10.10.1.50", objective: mission.description };
  }

  const raw = mission.content.trim();

  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as LabConfig;
    } catch {
      return { objective: raw };
    }
  }

  const marker = raw.indexOf("LAB_CONFIG:");
  if (marker >= 0) {
    try {
      const config = JSON.parse(raw.slice(marker + 11).trim()) as LabConfig;
      const brief = raw.slice(0, marker).trim();
      if (brief && !config.objective) {
        config.objective = brief.split("\n")[0]?.trim() || mission.description;
      }
      return config;
    } catch {
      return { objective: raw };
    }
  }

  return {
    target: "10.10.1.50",
    objective: raw,
    commands: { default: raw }
  };
}

export function matchLabAnswer(input: string, expected: string | null | undefined): boolean {
  if (!expected) return false;

  const value = input.toLowerCase().trim();
  const answer = expected.toLowerCase().trim();

  if (!value || !answer) return false;
  if (value === answer) return true;
  if (value.includes(answer) || answer.includes(value)) return true;

  return answer.split(/\s+/).every(token => token.length > 2 && value.includes(token));
}

export function matchesAcceptPatterns(input: string, patterns: string[] | undefined): boolean {
  if (!patterns?.length) return false;

  const value = input.toLowerCase();
  return patterns.some(pattern => value.includes(pattern.toLowerCase()));
}

export function resolveReconCommand(line: string, config: LabConfig, target: string): string | null {
  const lower = line.toLowerCase().trim();
  const commands = config.commands ?? {};
  const tool = lower.split(/\s+/)[0];

  if (commands[line]) return commands[line];
  if (commands[lower]) return commands[lower];

  for (const [key, output] of Object.entries(commands)) {
    if (lower.startsWith(key.toLowerCase())) return output;
  }

  const defaults: Record<string, string> = {
    nmap: `Starting Nmap 7.94 scan on ${target}
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9
80/tcp   open  http       Apache httpd 2.4.57
443/tcp  open  ssl/http   nginx 1.24.0
3306/tcp open  mysql      MySQL 8.0.33`,
    ping: `PING ${target}: 56 data bytes\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=12.4 ms`,
    whois: `Domain: nexuscorp.lab\nRegistrar: Simulated WHOIS\nCreated: 2024-01-15`,
    dig: `; ANSWER SECTION:\nstaging.nexuscorp.lab. 300 IN A 10.10.2.88\ndev.nexuscorp.lab. 300 IN A 10.10.2.55`,
    curl: `HTTP/1.1 200 OK\nServer: Apache/2.4.57\nTitle: NexusCorp Portal`,
    nc: `220 ProFTPD 1.3.5b Server [${target}]`,
    theharvester: `theHarvester -d nexuscorp.com -b google\nHosts found: 14\nvpn.nexuscorp.com → 203.0.113.10`,
    gobuster: `gobuster dir -u https://target.lab\n/admin (403)\n/backup (200)\n/.git/HEAD (200)`
  };

  if (defaults[tool]) return defaults[tool];
  return null;
}

export function inferWebMode(mission: PublicMission, config: LabConfig): WebLabMode {
  if (config.web?.mode) return config.web.mode;

  const category = mission.category.toLowerCase();

  if (category.includes("upload")) return "upload";
  if (category.includes("idor")) return "idor";
  if (category.includes("xss") || category.includes("search")) return "search";
  if (category.includes("cookie")) return "cookie";
  if (category.includes("jwt")) return "jwt";
  if (category.includes("csrf")) return "csrf";
  if (category.includes("directory")) return "dirb";
  if (category.includes("broken access") && !category.includes("csrf")) return "admin";
  if (category.includes("authentication")) return "cookie";
  if (
    category.includes("enumeration") ||
    category.includes("vulnerability analysis")
  ) {
    return "analyze";
  }

  return "login";
}

export function inferExploitMode(mission: PublicMission, config: LabConfig): ExploitLabMode {
  if (config.exploitMode) return config.exploitMode;

  const category = mission.category.toLowerCase();

  if (category.includes("metasploit")) return "msf";
  if (category.includes("cve investigation")) return "cve";
  if (category.includes("exploit matching")) return "match";
  if (category.includes("payload")) return "payload";
  if (category.includes("vulnerability analysis")) return "report";

  return "msf";
}

export function inferPasswordTool(mission: PublicMission, config: LabConfig): PasswordTool {
  if (config.passwordTool) return config.passwordTool;

  const category = mission.category.toLowerCase();
  if (category.includes("john")) return "john";
  if (category.includes("hashcat")) return "hashcat";
  if (category.includes("hash identifier")) return "john";
  return "hydra";
}

export function resolveLabComponent(type: string) {
  switch (type) {
    case "RECON":
    case "OSINT":
      return "recon" as const;
    case "WEB_ATTACK":
      return "web" as const;
    case "PASSWORD_ATTACK":
      return "password" as const;
    case "EXPLOITATION":
      return "exploit" as const;
    default:
      return "recon" as const;
  }
}

export const ATTACK_PATH_PHASES = [
  {
    id: "recon",
    step: 1,
    title: "Recon",
    subtitle: "Map targets with simulated OSINT and scanning tools."
  },
  {
    id: "enumeration",
    step: 2,
    title: "Enumeration",
    subtitle: "Discover services, directories, and attack surface details."
  },
  {
    id: "exploitation",
    step: 3,
    title: "Exploitation",
    subtitle: "Exploit web flaws and match vulnerabilities to payloads."
  },
  {
    id: "privilege",
    step: 4,
    title: "Privilege",
    subtitle: "Crack credentials and escalate access in safe simulations."
  },
  {
    id: "report",
    step: 5,
    title: "Report",
    subtitle: "Document findings and close out the engagement."
  }
] as const;

export type AttackPathPhaseId = (typeof ATTACK_PATH_PHASES)[number]["id"];

export function getAttackPathPhase(mission: PublicMission): AttackPathPhaseId {
  const category = mission.category.toLowerCase();
  const type = mission.type;

  if (
    category.includes("report") ||
    category.includes("vulnerability analysis") ||
    (type === "EXPLOITATION" && category.includes("cve investigation"))
  ) {
    return "report";
  }

  if (type === "PASSWORD_ATTACK") {
    return "privilege";
  }

  if (type === "EXPLOITATION") {
    return "exploitation";
  }

  if (type === "WEB_ATTACK") {
    if (
      category.includes("directory") ||
      category.includes("enumeration") ||
      category.includes("cookie")
    ) {
      return "enumeration";
    }
    return "exploitation";
  }

  if (type === "RECON" || type === "OSINT") {
    if (
      category.includes("enumeration") ||
      category.includes("service") ||
      category.includes("dns") ||
      category.includes("banner")
    ) {
      return "enumeration";
    }
    return "recon";
  }

  return "recon";
}

export function getPathMissions(
  phaseId: AttackPathPhaseId,
  missions: PublicMission[]
): PublicMission[] {
  return missions.filter(mission => getAttackPathPhase(mission) === phaseId);
}

export function matchesAttackPathPhase(
  mission: PublicMission,
  phaseId: AttackPathPhaseId | "ALL"
): boolean {
  if (phaseId === "ALL") return true;
  return getAttackPathPhase(mission) === phaseId;
}
