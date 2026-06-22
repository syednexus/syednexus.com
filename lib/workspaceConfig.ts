import type { PublicMission } from "@/types/PublicMission";
import { parseLabConfig } from "@/lib/labConfig";
import { parsePracticalConfig, resolvePracticalModule, type PracticalModule } from "@/lib/practicalConfig";
import { parseGameConfig } from "@/lib/gameTypes";

export type WorkspaceWindowId =
  | "terminal"
  | "browser"
  | "files"
  | "siem"
  | "wireshark"
  | "burp"
  | "metasploit"
  | "inbox"
  | "slack"
  | "tickets"
  | "nmap"
  | "network";

export type WorkspaceFile = {
  name: string;
  type: "log" | "pcap" | "image" | "doc" | "hash";
  content: string;
  size?: string;
  modified?: string;
};

export type WorkspaceTicket = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "closed";
  assignee?: string;
  mitre?: string;
};

export type WorkspaceAlert = {
  id: string;
  time: string;
  rule: string;
  severity: "critical" | "high" | "medium" | "low";
  host: string;
  mitre: string;
  log: string;
};

export type WorkspaceLayout = {
  module: PracticalModule | "soc";
  vmName: string;
  targetHost: string;
  vpnConnected: boolean;
  defaultWindows: WorkspaceWindowId[];
  objectives: string[];
  files: WorkspaceFile[];
  alerts: WorkspaceAlert[];
  tickets: WorkspaceTicket[];
  browserUrl: string;
  browserTitle: string;
};

const DEFAULT_FILES: WorkspaceFile[] = [
  { name: "notes.txt", type: "doc", content: "Investigation scratchpad — document findings here.", size: "2 KB" },
  { name: "scope.pdf", type: "doc", content: "Authorized testing scope — staging environment only.", size: "148 KB" }
];

const DEFAULT_SOC_ALERTS: WorkspaceAlert[] = [
  {
    id: "ALT-1042",
    time: "09:14:22",
    rule: "Impossible Travel — Authentication",
    severity: "high",
    host: "workstation-07",
    mitre: "T1078",
    log: "User jsmith logged in from IP 185.220.101.45 (Tor exit) 4 minutes after login from Austin, TX."
  },
  {
    id: "ALT-1043",
    time: "09:18:01",
    rule: "Brute Force — SSH",
    severity: "medium",
    host: "bastion-01",
    mitre: "T1110",
    log: "47 failed SSH attempts from 10.0.4.88 targeting root in 5 minutes."
  },
  {
    id: "ALT-1044",
    time: "09:22:33",
    rule: "Malware Beacon — DNS",
    severity: "critical",
    host: "laptop-19",
    mitre: "T1071.004",
    log: "Periodic DNS queries to x7k9.malware-c2.lab every 60 seconds."
  }
];

const DEFAULT_TICKETS: WorkspaceTicket[] = [
  { id: "INC-2201", title: "Impossible travel on jsmith", severity: "high", status: "open", mitre: "T1078" },
  { id: "INC-2202", title: "SSH brute force on bastion", severity: "medium", status: "investigating", mitre: "T1110" },
  { id: "INC-2198", title: "Phishing report — finance team", severity: "low", status: "closed", assignee: "tier1" }
];

/** Keep one instance per tool window — React keys must be unique. */
export function uniqueWindowIds(ids: WorkspaceWindowId[]): WorkspaceWindowId[] {
  return [...new Set(ids)];
}

export function buildWorkspaceLayout(mission: PublicMission, variant: "practical" | "soc" = "practical"): WorkspaceLayout {
  const lab = parseLabConfig(mission);
  const practical = parsePracticalConfig(mission);
  const game = parseGameConfig(mission);

  const module = variant === "soc" ? "soc" : resolvePracticalModule(mission.type);
  const targetHost = lab.target ?? game.scanTarget ?? "10.10.1.50";

  const objectives = [
    practical.objective ?? lab.objective,
    mission.scenario,
    mission.description
  ].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index);

  const forensicsFiles: WorkspaceFile[] =
    practical.forensics?.artifacts?.map(artifact => ({
      name: artifact.name,
      type: "log" as const,
      content: artifact.content,
      size: `${Math.max(1, Math.round(artifact.content.length / 80))} KB`
    })) ?? [];

  const files =
    forensicsFiles.length > 0
      ? [...forensicsFiles, ...DEFAULT_FILES]
      : [
          ...DEFAULT_FILES,
          {
            name: "auth.log",
            type: "log" as const,
            content: "Mar 12 09:14:22 sshd[4421]: Failed password for root from 10.0.4.88",
            size: "24 KB"
          },
          {
            name: "capture.pcap",
            type: "pcap" as const,
            content: "Simulated packet capture — open Wireshark to analyze HTTP traffic.",
            size: "4.2 MB"
          }
        ];

  const base: WorkspaceLayout = {
    module,
    vmName: "Nexus Kali VM",
    targetHost,
    vpnConnected: true,
    defaultWindows: [],
    objectives,
    files,
    alerts: DEFAULT_SOC_ALERTS,
    tickets: DEFAULT_TICKETS,
    browserUrl: `http://${targetHost}`,
    browserTitle: "Nexus Bank — Secure Login"
  };

  switch (module) {
    case "attack": {
      const windows: WorkspaceWindowId[] = ["terminal"];
      if (mission.type === "WEB_ATTACK") windows.push("browser", "burp");
      if (mission.type === "EXPLOITATION") windows.push("metasploit");
      if (mission.type === "PASSWORD_ATTACK") windows.push("files");
      if (mission.type === "RECON" || mission.type === "OSINT") windows.push("nmap", "network");
      if (windows.length === 1) windows.push("browser");
      return { ...base, defaultWindows: uniqueWindowIds(windows) };
    }
    case "games":
      return { ...base, defaultWindows: uniqueWindowIds(["terminal", "files"]) };
    case "forensics":
      return { ...base, defaultWindows: uniqueWindowIds(["files", "wireshark"]) };
    case "tools": {
      const tool = practical.tool?.tool ?? "nmap";
      const map: Record<string, WorkspaceWindowId[]> = {
        nmap: ["nmap", "terminal"],
        wireshark: ["wireshark", "files"],
        burp: ["burp", "browser"],
        hydra: ["terminal", "files"],
        john: ["terminal", "files"],
        hashcat: ["terminal", "files"],
        msf: ["metasploit", "terminal"]
      };
      return { ...base, defaultWindows: uniqueWindowIds(map[tool] ?? ["terminal", "nmap"]) };
    }
    case "career": {
      const mode = practical.career?.mode ?? "soc";
      return {
        ...base,
        defaultWindows: uniqueWindowIds(
          mode === "pentest"
            ? ["browser", "terminal", "files"]
            : ["inbox", "siem", "slack", "tickets"]
        )
      };
    }
    case "soc":
      return { ...base, defaultWindows: uniqueWindowIds(["siem", "tickets", "wireshark", "files"]) };
    default:
      return { ...base, defaultWindows: uniqueWindowIds(["terminal"]) };
  }
}

export const WINDOW_LABELS: Record<WorkspaceWindowId, string> = {
  terminal: "Terminal",
  browser: "Browser",
  files: "Evidence / Files",
  siem: "Nexus SIEM",
  wireshark: "Wireshark",
  burp: "Burp Suite",
  metasploit: "Metasploit",
  inbox: "Inbox",
  slack: "Nexus Slack",
  tickets: "Ticket Queue",
  nmap: "Nmap Scanner",
  network: "Network Map"
};
