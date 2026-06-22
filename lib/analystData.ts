export type AnalystData = {
  xp: number;
  rank: string;
  completed: number;
  next: number;
  completedMissionIds: number[];
};

const defaultAnalyst: AnalystData = {
  xp: 0,
  rank: "Loading",
  completed: 0,
  next: 100,
  completedMissionIds: []
};

const STORAGE_KEY = "nexus_analyst_cache_v1";
const CACHE_TTL_MS = 60 * 1000;

type CacheEntry = {
  data: AnalystData;
  savedAt: number;
};

let memoryCache: CacheEntry | null = null;
let inflight: Promise<AnalystData> | null = null;

function readSessionCache(): CacheEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed?.data || !parsed.savedAt) {
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

function writeSessionCache(data: AnalystData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entry = { data, savedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    memoryCache = entry;
  } catch {
    memoryCache = { data, savedAt: Date.now() };
  }
}

export function getInitialAnalyst(): AnalystData {
  const cached = memoryCache || readSessionCache();
  return cached?.data ?? defaultAnalyst;
}

export async function loadAnalyst(options?: { force?: boolean }): Promise<AnalystData> {
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
    const res = await fetch("/api/analyst", { cache: "no-store" });
    const data = (await res.json()) as AnalystData;
    const normalized: AnalystData = {
      ...data,
      completedMissionIds: data.completedMissionIds ?? []
    };
    writeSessionCache(normalized);
    return normalized;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function invalidateAnalystCache() {
  memoryCache = null;
  inflight = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
