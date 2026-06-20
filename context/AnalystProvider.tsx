"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useMissions } from "@/context/MissionsProvider";
import { useNexus } from "@/context/NexusContext";
import { getRankFromXp, type NexusRank } from "@/lib/rank";

type AnalystContextType = {
  rank: NexusRank;
  xp: number;
  completedMissions: number;
  totalMissions: number;
  completionPercentage: number;
};

const AnalystContext = createContext<AnalystContextType | null>(null);

export function AnalystProvider({ children }: { children: ReactNode }) {
  const { xp } = useNexus();
  const { missions, completedSlugs } = useMissions();

  const value = useMemo(() => {
    const rank = getRankFromXp(xp);
    const completedMissions = completedSlugs.length;
    const totalMissions = missions.length;
    const completionPercentage =
      totalMissions > 0
        ? Math.round((completedMissions / totalMissions) * 100)
        : 0;

    return {
      rank,
      xp,
      completedMissions,
      totalMissions,
      completionPercentage,
    };
  }, [completedSlugs, missions, xp]);

  return (
    <AnalystContext.Provider value={value}>{children}</AnalystContext.Provider>
  );
}

export function useAnalyst() {
  const context = useContext(AnalystContext);

  if (!context) {
    throw new Error("useAnalyst must be used inside AnalystProvider");
  }

  return context;
}

export function useAnalystOptional() {
  return useContext(AnalystContext);
}
