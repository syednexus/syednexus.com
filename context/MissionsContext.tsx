"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  getInitialMissions,
  loadMissions
} from "@/lib/missionsData";

import type { PublicMission } from "@/types/PublicMission";

type MissionsContextValue = {
  missions: PublicMission[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const MissionsContext = createContext<MissionsContextValue | null>(null);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<PublicMission[]>(() => getInitialMissions());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await loadMissions({ force: true });
      setMissions(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load missions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const next = await loadMissions();
        if (active) {
          setMissions(next);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load missions");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    function handleRefresh() {
      refresh().catch(() => undefined);
    }

    window.addEventListener("nexus-app-refresh", handleRefresh);

    return () => {
      active = false;
      window.removeEventListener("nexus-app-refresh", handleRefresh);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ missions, loading, error, refresh }),
    [missions, loading, error, refresh]
  );

  return (
    <MissionsContext.Provider value={value}>
      {children}
    </MissionsContext.Provider>
  );
}

function useMissionsContext() {
  const ctx = useContext(MissionsContext);
  if (!ctx) {
    throw new Error("MissionsProvider missing");
  }
  return ctx;
}

export function useMissions(type?: string) {
  const { missions } = useMissionsContext();
  return type ? missions.filter(m => m.type === type) : missions;
}

export function useMissionsStatus() {
  const { loading, error, refresh } = useMissionsContext();
  return { loading, error, refresh };
}
