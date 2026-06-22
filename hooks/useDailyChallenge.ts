"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getInitialDaily,
  loadDaily,
  type DailyChallengeData
} from "@/lib/dailyData";

export function useDailyChallenge() {
  const [daily, setDaily] = useState<DailyChallengeData>(() => getInitialDaily());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await loadDaily({ force: true });
      setDaily(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily challenge");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const next = await loadDaily();
        if (active) {
          setDaily(next);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load daily challenge");
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

  return { daily, loading, error, refresh };
}
