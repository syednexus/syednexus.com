export const NEXUS_OS_MODULES = {
  games: {
    path: "/games",
    title: "NEXUS CYBER GAMES",
    description:
      "Interactive training simulations — Linux challenges, network puzzles, command drills, and quizzes.",
    allowedTypes: [
      "LINUX_GAME",
      "NETWORK_GAME",
      "COMMAND_CHALLENGE",
      "QUIZ",
      "PORT_HUNTER",
      "PACKET_ANALYSIS"
    ],
    categoryKeywords: ["linux", "recon", "game", "quiz", "training", "puzzle"]
  },
  soc: {
    path: "/soc",
    title: "NEXUS SOC CENTER",
    description:
      "Security operations range — triage alerts, hunt threats, analyze malware, and close incidents.",
    allowedTypes: [
      "SOC_ALERT",
      "SIEM",
      "PHISHING",
      "MALWARE",
      "THREAT_HUNT",
      "INCIDENT_RESPONSE",
      "NETWORK",
      "TERMINAL"
    ]
  },
  attack: {
    path: "/attack",
    title: "NEXUS ATTACK LAB",
    description:
      "Offensive security exercises — reconnaissance, web attacks, exploitation, and password attacks.",
    allowedTypes: [
      "RECON",
      "OSINT",
      "WEB_ATTACK",
      "EXPLOITATION",
      "PASSWORD_ATTACK"
    ]
  },
  forensics: {
    path: "/forensics",
    title: "NEXUS FORENSICS LAB",
    description:
      "Digital forensics investigations — disk analysis, memory forensics, and file recovery.",
    allowedTypes: ["FORENSICS", "MEMORY_ANALYSIS", "FILE_RECOVERY"]
  },
  tools: {
    path: "/tools",
    title: "NEXUS TOOLS RANGE",
    description:
      "Security tool simulations — practice with industry-standard analyst and pentest tooling.",
    allowedTypes: ["TOOL_SIMULATION"]
  },
  career: {
    path: "/career",
    title: "NEXUS CAREER PATH",
    description:
      "Role-based career scenarios — step through real-world analyst and engineer workflows.",
    allowedTypes: ["CAREER_SCENARIO"]
  }
} as const;

export type NexusOsModuleKey = keyof typeof NEXUS_OS_MODULES;
