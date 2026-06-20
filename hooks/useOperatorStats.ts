"use client";

import { useMemo } from "react";

import { useAnalystOptional } from "@/context/AnalystProvider";
import { useMissions } from "@/context/MissionsProvider";
import { useNexus } from "@/context/NexusContext";
import { getRankFromXp } from "@/lib/rank";

export function useOperatorStats() {
  const analyst = useAnalystOptional();
  const { xp } = useNexus();
  const { missions, completedSlugs } = useMissions();

  return useMemo(() => {
    if (analyst) {
      return analyst;
    }

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
  }, [analyst, completedSlugs, missions, xp]);
}
