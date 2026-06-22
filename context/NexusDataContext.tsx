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
  getInitialNexusData,
  loadNexusData,
  type NexusProfile
} from "@/lib/nexusData";

type NexusDataContextValue = {
  data: NexusProfile;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const NexusDataContext = createContext<NexusDataContextValue | null>(null);

export function NexusDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NexusProfile>(() => getInitialNexusData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await loadNexusData({ force: true });
      setData(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Nexus data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const next = await loadNexusData();
        if (active) {
          setData(next);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load Nexus data");
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
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh]
  );

  return (
    <NexusDataContext.Provider value={value}>
      {children}
    </NexusDataContext.Provider>
  );
}

export function useNexusDataContext() {
  const ctx = useContext(NexusDataContext);
  if (!ctx) {
    throw new Error("NexusDataProvider missing");
  }
  return ctx;
}

export function useNexusData() {
  return useNexusDataContext().data;
}

export function useNexusDataStatus() {
  const { loading, error, refresh } = useNexusDataContext();
  return { loading, error, refresh };
}
