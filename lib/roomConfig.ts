import type { PublicMission } from "@/types/PublicMission";
import { parseLabConfig } from "@/lib/labConfig";
import { parsePracticalConfig } from "@/lib/practicalConfig";

export type RoomTask = {
  id: number;
  objective: string;
  validator: string;
  hint?: string;
};

export type RoomConfig = {
  title?: string;
  introduction?: string;
  learningObjectives?: string[];
  requiredKnowledge?: string[];
  estimatedMinutes?: number;
  difficulty?: string;
  tasks?: RoomTask[];
};

const DEFAULT_TASKS: RoomTask[] = [
  { id: 1, objective: "Enumerate the target environment", validator: "nmap_completed" },
  { id: 2, objective: "Collect evidence from tools", validator: "evidence_collected" },
  { id: 3, objective: "Submit your finding", validator: "finding_submitted" }
];

export function parseRoomConfig(mission: PublicMission): RoomConfig {
  const lab = parseLabConfig(mission);
  const practical = parsePracticalConfig(mission);
  const raw = mission.content?.trim() ?? "";

  let parsed: Record<string, unknown> = {};

  if (raw.startsWith("{")) {
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      parsed = {};
    }
  } else {
    const roomMarker = raw.indexOf("ROOM_CONFIG:");
    const practicalMarker = raw.indexOf("PRACTICAL_CONFIG:");
    const labMarker = raw.indexOf("LAB_CONFIG:");
    const marker = roomMarker >= 0 ? roomMarker : practicalMarker >= 0 ? practicalMarker : labMarker;
    if (marker >= 0) {
      const tag = raw.slice(marker, marker + 20);
      const offset = tag.startsWith("ROOM_CONFIG:")
        ? 12
        : tag.startsWith("PRACTICAL_CONFIG:")
          ? 17
          : 11;
      try {
        parsed = JSON.parse(raw.slice(marker + offset).trim()) as Record<string, unknown>;
      } catch {
        parsed = {};
      }
    }
  }

  const room = (parsed.room ?? parsed) as RoomConfig;
  const tasks =
    (parsed.tasks as RoomTask[] | undefined) ??
    room.tasks ??
    (parsed.stages as RoomTask[] | undefined);

  return {
    title: room.title ?? mission.title,
    introduction: room.introduction ?? mission.scenario ?? mission.description,
    learningObjectives:
      room.learningObjectives ??
      (practical.objective ? [practical.objective] : [mission.description]),
    requiredKnowledge:
      room.requiredKnowledge ?? ["Basic Linux commands", "Security fundamentals"],
    estimatedMinutes: room.estimatedMinutes ?? estimateMinutes(mission.difficulty),
    difficulty: room.difficulty ?? mission.difficulty,
    tasks: tasks?.length ? tasks : buildDefaultTasks(mission, lab.objective)
  };
}

function estimateMinutes(difficulty: string): number {
  const map: Record<string, number> = {
    easy: 15,
    beginner: 15,
    medium: 30,
    hard: 45,
    expert: 60
  };
  return map[difficulty.toLowerCase()] ?? 25;
}

function buildDefaultTasks(mission: PublicMission, objective?: string): RoomTask[] {
  if (mission.type.includes("SOC") || mission.type === "SIEM") {
    return [
      { id: 1, objective: "Review SIEM alert queue", validator: "siem_alert_reviewed" },
      { id: 2, objective: "Investigate evidence and timeline", validator: "evidence_collected" },
      { id: 3, objective: "Submit verdict and close case", validator: "finding_submitted" }
    ];
  }
  if (["WEB_ATTACK", "RECON", "EXPLOITATION"].includes(mission.type)) {
    return [
      { id: 1, objective: objective ?? "Scan target", validator: "nmap_completed" },
      { id: 2, objective: "Interact with vulnerable service", validator: "browser_payload_tested" },
      { id: 3, objective: "Submit finding", validator: "finding_submitted" }
    ];
  }
  return DEFAULT_TASKS.map(task =>
    task.id === 1 && objective ? { ...task, objective } : task
  );
}

export function buildRoomContent(brief: string, config: RoomConfig & { tasks?: RoomTask[] }): string {
  const json = JSON.stringify({ room: config, tasks: config.tasks });
  return brief.trim() ? `${brief.trim()}\n\nROOM_CONFIG:${json}` : `ROOM_CONFIG:${json}`;
}
