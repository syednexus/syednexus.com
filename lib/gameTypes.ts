import type { PublicMission } from "@/types/PublicMission";

export const GAME_MISSION_TYPES = [
  "LINUX_GAME",
  "COMMAND_CHALLENGE",
  "NETWORK_GAME",
  "PACKET_ANALYSIS",
  "QUIZ",
  "PORT_HUNTER"
] as const;

export type GameMissionType = (typeof GAME_MISSION_TYPES)[number];

export function isGameMissionType(type: string): type is GameMissionType {
  return (GAME_MISSION_TYPES as readonly string[]).includes(type);
}

export type GameConfig = {
  trigger?: string;
  triggerMatch?: "exact" | "includes";
  vfs?: Record<string, string | Record<string, unknown>>;
  cwd?: string;
  scanTarget?: string;
  ports?: Array<{ port: number; service: string; state: string; note?: string }>;
  packets?: Array<{
    id: string;
    time: string;
    src: string;
    dst: string;
    proto: string;
    info: string;
    flag?: boolean;
  }>;
  quiz?: {
    kind: "mc" | "tf" | "short";
    question: string;
    options?: string[];
    correct: string;
  };
};

export function parseGameConfig(mission: PublicMission): GameConfig {
  if (!mission.content?.trim()) {
    return {};
  }

  const raw = mission.content.trim();

  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as GameConfig;
    } catch {
      return {};
    }
  }

  const marker = raw.indexOf("GAME_CONFIG:");
  if (marker >= 0) {
    try {
      return JSON.parse(raw.slice(marker + 12).trim()) as GameConfig;
    } catch {
      return {};
    }
  }

  return {};
}

export function resolveGameComponent(type: string) {
  switch (type) {
    case "LINUX_GAME":
    case "COMMAND_CHALLENGE":
      return "terminal" as const;
    case "NETWORK_GAME":
    case "PORT_HUNTER":
      return "network" as const;
    case "PACKET_ANALYSIS":
      return "packet" as const;
    case "QUIZ":
      return "quiz" as const;
    default:
      return "terminal" as const;
  }
}
