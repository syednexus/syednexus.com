const GLOBE_STATE_KEY = "nexus_globe_state_v1";

export type GlobePersistedState = {
  focusId: string | null;
  activeHotspot: string | null;
  dockOpen: boolean;
};

export function saveGlobeState(state: GlobePersistedState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GLOBE_STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function loadGlobeState(): GlobePersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GLOBE_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GlobePersistedState;
  } catch {
    return null;
  }
}

export function clearGlobeState() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GLOBE_STATE_KEY);
  } catch {
    /* ignore */
  }
}
