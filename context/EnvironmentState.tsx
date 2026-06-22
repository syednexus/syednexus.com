"use client";

import type { TrackedAction } from "@/lib/actionTracking";
import type { DesktopPresetId } from "@/lib/world/desktopPresets";
import type { RoomEnvironmentSnapshot } from "@/lib/world/types";

export function createEmptyRoomSnapshot(missionSlug: string): RoomEnvironmentSnapshot {
  return {
    missionSlug,
    notes: "",
    evidence: [],
    discoveredFiles: [],
    openedEvidence: [],
    actions: [],
    completedTaskIds: [],
    toolHistory: [],
    desktopPreset: null,
    updatedAt: Date.now()
  };
}

export function mergeRoomSnapshot(
  base: RoomEnvironmentSnapshot,
  patch: Partial<RoomEnvironmentSnapshot>
): RoomEnvironmentSnapshot {
  return {
    ...base,
    ...patch,
    updatedAt: Date.now()
  };
}

export function actionToToolName(action: TrackedAction): string | null {
  const map: Partial<Record<TrackedAction["type"], string>> = {
    command: "terminal",
    file_open: "files",
    packet_inspect: "wireshark",
    packet_filter: "wireshark",
    siem_alert: "siem",
    browser_payload: "browser",
    burp_intercept: "burp",
    burp_repeater: "burp",
    network_inspect: "network",
    hash_verified: "files",
    evidence: "evidence",
    finding_submitted: "report"
  };
  return map[action.type] ?? action.type;
}

export type EnvironmentPersistPayload = {
  notes: string;
  evidence: string[];
  actions: TrackedAction[];
  completedTaskIds: number[];
  desktopPreset: DesktopPresetId | null;
};

export function snapshotFromPayload(
  missionSlug: string,
  payload: EnvironmentPersistPayload,
  previous: RoomEnvironmentSnapshot | null
): RoomEnvironmentSnapshot {
  const base = previous ?? createEmptyRoomSnapshot(missionSlug);
  const toolHistory = [
    ...base.toolHistory,
    ...payload.actions
      .slice(-3)
      .map(actionToToolName)
      .filter((tool): tool is string => Boolean(tool))
  ].filter((tool, index, list) => list.indexOf(tool) === index);

  const discoveredFiles = [
    ...base.discoveredFiles,
    ...payload.actions
      .filter(action => action.type === "file_open")
      .map(action => action.value)
  ].filter((file, index, list) => list.indexOf(file) === index);

  const openedEvidence = [
    ...base.openedEvidence,
    ...payload.evidence
  ].filter((item, index, list) => list.indexOf(item) === index);

  return mergeRoomSnapshot(base, {
    notes: payload.notes,
    evidence: payload.evidence,
    actions: payload.actions,
    completedTaskIds: payload.completedTaskIds,
    desktopPreset: payload.desktopPreset,
    toolHistory,
    discoveredFiles,
    openedEvidence
  });
}
