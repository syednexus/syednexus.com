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
  getInitialAnalyst,
  loadAnalyst,
  type AnalystData
} from "@/lib/analystData";

type AnalystContextValue = {
  analyst: AnalystData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const AnalystContext = createContext<AnalystContextValue | null>(null);

export function AnalystProvider({ children }: { children: ReactNode }) {
  const [analyst, setAnalyst] = useState<AnalystData>(() => getInitialAnalyst());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await loadAnalyst({ force: true });
      setAnalyst(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analyst profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const next = await loadAnalyst();
        if (active) {
          setAnalyst(next);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load analyst profile");
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
    () => ({ analyst, loading, error, refresh }),
    [analyst, loading, error, refresh]
  );

  return (
    <AnalystContext.Provider value={value}>
      {children}
    </AnalystContext.Provider>
  );
}

export function useAnalyst() {
  const ctx = useContext(AnalystContext);
  if (!ctx) {
    throw new Error("AnalystProvider missing");
  }
  return ctx.analyst;
}

export function useAnalystStatus() {
  const { loading, error, refresh } = useContext(AnalystContext)!;
  return { loading, error, refresh };
}
