export type MissionType =
  | "LINUX_GAME"
  | "NETWORK_GAME"
  | "COMMAND_CHALLENGE"
  | "QUIZ"
  | "SOC_ALERT"
  | "SIEM"
  | "PHISHING"
  | "MALWARE"
  | "THREAT_HUNT"
  | "RECON"
  | "WEB_ATTACK"
  | "EXPLOITATION"
  | "PASSWORD_ATTACK"
  | "FORENSICS"
  | "MEMORY_ANALYSIS"
  | "FILE_RECOVERY"
  | "TOOL_SIMULATION"
  | "CAREER_SCENARIO"
  | "PROMPT_INJECTION"
  | "AI_PHISHING_DETECTION";

export type MissionDifficulty = "beginner" | "intermediate" | "advanced";

export type Mission = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: MissionType;
  difficulty: MissionDifficulty;
  xpReward: number;
  duration: string;
  tags: string[];
};

export const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  LINUX_GAME: "Linux Game",
  NETWORK_GAME: "Network Game",
  COMMAND_CHALLENGE: "Command Challenge",
  QUIZ: "Quiz",
  SOC_ALERT: "SOC Alert",
  SIEM: "SIEM",
  PHISHING: "Phishing",
  MALWARE: "Malware",
  THREAT_HUNT: "Threat Hunt",
  RECON: "Reconnaissance",
  WEB_ATTACK: "Web Attack",
  EXPLOITATION: "Exploitation",
  PASSWORD_ATTACK: "Password Attack",
  FORENSICS: "Forensics",
  MEMORY_ANALYSIS: "Memory Analysis",
  FILE_RECOVERY: "File Recovery",
  TOOL_SIMULATION: "Tool Simulation",
  CAREER_SCENARIO: "Career Scenario",
  PROMPT_INJECTION: "Prompt Injection",
  AI_PHISHING_DETECTION: "AI Phishing Detection",
};

export const MODULE_MISSION_TYPES = {
  games: [
    "LINUX_GAME",
    "NETWORK_GAME",
    "COMMAND_CHALLENGE",
    "QUIZ",
  ] as MissionType[],
  soc: [
    "SOC_ALERT",
    "SIEM",
    "PHISHING",
    "MALWARE",
    "THREAT_HUNT",
  ] as MissionType[],
  attack: [
    "RECON",
    "WEB_ATTACK",
    "EXPLOITATION",
    "PASSWORD_ATTACK",
  ] as MissionType[],
  forensics: [
    "FORENSICS",
    "MEMORY_ANALYSIS",
    "FILE_RECOVERY",
  ] as MissionType[],
  tools: ["TOOL_SIMULATION"] as MissionType[],
  career: ["CAREER_SCENARIO"] as MissionType[],
  aiLab: ["PROMPT_INJECTION", "AI_PHISHING_DETECTION"] as MissionType[],
};
