import type { SaveSlotId, WorldPersistedState } from "@/lib/world/types";

export const SAVE_SLOTS: SaveSlotId[] = ["A", "B", "C"];

export const WORLD_STORAGE_KEY = "nexus_v36_world_v1";

function emptySlot() {
  return {
    credits: 50,
    completedRooms: [] as string[],
    chainArtifacts: [] as WorldPersistedState["slots"]["A"]["chainArtifacts"],
    careerWeek: null,
    unlockedContracts: [] as WorldPersistedState["slots"]["A"]["unlockedContracts"],
    purchasedThemes: [] as string[],
    privateLabUnlocked: false,
    certificationProgress: {} as Record<string, string[]>,
    analytics: [] as WorldPersistedState["slots"]["A"]["analytics"],
    rooms: {} as WorldPersistedState["slots"]["A"]["rooms"]
  };
}

export function createDefaultWorldState(): WorldPersistedState {
  return {
    version: 1,
    activeSlot: "A",
    slots: {
      A: emptySlot(),
      B: emptySlot(),
      C: emptySlot()
    }
  };
}

export function loadWorldState(): WorldPersistedState {
  if (typeof window === "undefined") return createDefaultWorldState();

  try {
    const raw = localStorage.getItem(WORLD_STORAGE_KEY);
    if (!raw) return createDefaultWorldState();
    const parsed = JSON.parse(raw) as WorldPersistedState;
    if (parsed.version !== 1) return createDefaultWorldState();
    return parsed;
  } catch {
    return createDefaultWorldState();
  }
}

export function saveWorldState(state: WorldPersistedState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORLD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded — silent fail
  }
}

export function getActiveSlotState(state: WorldPersistedState) {
  return state.slots[state.activeSlot];
}

export function slotLabel(slot: SaveSlotId): string {
  return `Profile ${slot}`;
}
