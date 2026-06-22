import type { TrackedAction } from "@/lib/actionTracking";
import type { DesktopPresetId } from "@/lib/world/desktopPresets";
import type { OrganizationId } from "@/lib/world/organizations";

export type SaveSlotId = "A" | "B" | "C";

export type RoomEnvironmentSnapshot = {
  missionSlug: string;
  notes: string;
  evidence: string[];
  discoveredFiles: string[];
  openedEvidence: string[];
  actions: TrackedAction[];
  completedTaskIds: number[];
  toolHistory: string[];
  desktopPreset: DesktopPresetId | null;
  updatedAt: number;
};

export type ChainArtifact = {
  chainId: string;
  missionSlug: string;
  outputKey: string;
  outputValue: string;
  createdAt: number;
};

export type CareerDayEvent = {
  id: string;
  type: "email" | "ticket" | "meeting" | "alert" | "deadline";
  title: string;
  body: string;
  priority: "low" | "medium" | "high" | "critical";
  resolved: boolean;
};

export type CareerWeekState = {
  weekId: string;
  dayIndex: number;
  events: CareerDayEvent[];
  performanceScore: number;
  managerReview: string | null;
};

export type AnalyticsEvent = {
  id: string;
  type:
    | "room_enter"
    | "room_complete"
    | "room_abandon"
    | "task_complete"
    | "tool_use"
    | "hint_purchased"
    | "drop_off";
  missionSlug?: string;
  organizationId?: OrganizationId;
  payload?: Record<string, string | number | boolean>;
  at: number;
};

export type WorldPersistedState = {
  version: 1;
  activeSlot: SaveSlotId;
  slots: Record<
    SaveSlotId,
    {
      credits: number;
      completedRooms: string[];
      chainArtifacts: ChainArtifact[];
      careerWeek: CareerWeekState | null;
      unlockedContracts: OrganizationId[];
      purchasedThemes: string[];
      privateLabUnlocked: boolean;
      certificationProgress: Record<string, string[]>;
      analytics: AnalyticsEvent[];
      rooms: Record<string, RoomEnvironmentSnapshot>;
    }
  >;
};

export type WorldMissionMeta = {
  organizationId: OrganizationId;
  chainId?: string;
  chainStep?: number;
  chainOutputKey?: string;
  prerequisiteSlug?: string;
  injectInto?: ("siem" | "files" | "tickets" | "inbox")[];
  careerDay?: number;
};
