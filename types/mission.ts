export const MISSION_TYPES = [

  // SOC / Blue Team

  "SOC_ALERT",

  "SIEM",

  "PHISHING",

  "MALWARE",

  "THREAT_HUNT",

  "INCIDENT_RESPONSE",

  "NETWORK",

  "TERMINAL",

  // Attack Lab

  "RECON",

  "OSINT",

  "WEB_ATTACK",

  "EXPLOITATION",

  "PASSWORD_ATTACK",

  // Forensics

  "FORENSICS",

  "MEMORY_ANALYSIS",

  "FILE_RECOVERY",

  // Cyber Games

  "LINUX_GAME",

  "NETWORK_GAME",

  "COMMAND_CHALLENGE",

  "QUIZ",

  "PORT_HUNTER",

  "PACKET_ANALYSIS",

  // Tools & Career

  "TOOL_SIMULATION",

  "CAREER_SCENARIO"

] as const;



export type MissionType = (typeof MISSION_TYPES)[number];



export type Mission = {

  id: number;

  title: string;

  slug: string;

  type: MissionType | string;

  category: string;

  difficulty: string;

  description: string;

  scenario?: string | null;

  content?: string | null;

  answer?: string | null;

  explanation?: string | null;

  hints?: string[];

  xp: number;

  active?: boolean;

  createdAt?: string;

  updatedAt?: string;

};



export type MissionProgress = {

  id: number;

  missionId: number;

  userId: string;

  completed: boolean;

  score: number;

  attempts: number;

  completedAt: string | null;

  createdAt: string;

};



export type MissionCompleteResult = {

  success: boolean;

  message: string;

};



export function isMissionType(value: string): value is MissionType {

  return (MISSION_TYPES as readonly string[]).includes(value);

}



export function normalizeMissionType(type: string): MissionType | "UNKNOWN" {

  return isMissionType(type) ? type : "UNKNOWN";

}

