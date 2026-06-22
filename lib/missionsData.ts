import type { PublicMission } from "@/types/PublicMission";

const STORAGE_KEY = "nexus_public_missions_v3_6_secure";
const LEGACY_KEYS = ["nexus_missions_cache_v4", "nexus_missions_cache_v3"];
const CACHE_TTL_MS = 2 * 60 * 1000;

type CacheEntry = {
  data: PublicMission[];
  savedAt: number;
};

let memoryCache: CacheEntry | null = null;
let inflight: Promise<PublicMission[]> | null = null;

function purgeLegacyCaches() {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_KEYS) {
    sessionStorage.removeItem(key);
  }
}

function readSessionCache(): CacheEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  purgeLegacyCaches();

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEntry;
    if (!Array.isArray(parsed?.data) || !parsed.savedAt) {
      return null;
    }

    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSessionCache(data: PublicMission[]) {
  if (typeof window === "undefined") {
    return;
  }

  purgeLegacyCaches();

  try {
    const entry = { data, savedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    memoryCache = entry;
  } catch {
    memoryCache = { data, savedAt: Date.now() };
  }
}

export function getInitialMissions(): PublicMission[] {
  const cached = memoryCache || readSessionCache();
  return cached?.data ?? [];
}

export async function loadMissions(options?: { force?: boolean }): Promise<PublicMission[]> {
  const force = options?.force ?? false;

  if (!force) {
    const cached = memoryCache || readSessionCache();
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
      memoryCache = cached;
      return cached.data;
    }
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    const res = await fetch("/api/missions", { cache: "no-store" });
    const data = (await res.json()) as PublicMission[];
    writeSessionCache(data);
    return data;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function invalidateMissionsCache() {
  memoryCache = null;
  inflight = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
    purgeLegacyCaches();
  }
}
