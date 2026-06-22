import type { Mission } from "@/types/mission";

export type DailyStreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  dailyCompleted: boolean;
};

export type DailyChallengeData = {
  challenge: {
    id: number;
    missionId: number;
    date: string;
    mission: Mission;
  } | null;
  streak: DailyStreakInfo;
};

const defaultDaily: DailyChallengeData = {
  challenge: null,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    dailyCompleted: false
  }
};

const STORAGE_KEY = "nexus_daily_cache_v1";
const CACHE_TTL_MS = 60 * 1000;

type CacheEntry = {
  data: DailyChallengeData;
  savedAt: number;
};

let memoryCache: CacheEntry | null = null;
let inflight: Promise<DailyChallengeData> | null = null;

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

function writeSessionCache(data: DailyChallengeData) {
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

export function getInitialDaily(): DailyChallengeData {
  const cached = memoryCache || readSessionCache();
  return cached?.data ?? defaultDaily;
}

export async function loadDaily(options?: { force?: boolean }): Promise<DailyChallengeData> {
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
    const res = await fetch("/api/daily", { cache: "no-store" });
    const data = (await res.json()) as DailyChallengeData;
    writeSessionCache(data);
    return data;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function invalidateDailyCache() {
  memoryCache = null;
  inflight = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
