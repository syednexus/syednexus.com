"use client";

import { useMemo } from "react";

import { useAnalystOptional } from "@/context/AnalystProvider";
import { useMissionsOptional } from "@/context/MissionsProvider";
import { useNexusOptional } from "@/context/NexusContext";
import { getRankFromXp } from "@/lib/rank";

const DEFAULT_STATS = {
  rank: getRankFromXp(0),
  xp: 0,
  completedMissions: 0,
  totalMissions: 0,
  completionPercentage: 0,
};

export function useOperatorStats() {
  const analyst = useAnalystOptional();
  const nexus = useNexusOptional();
  const missions = useMissionsOptional();

  return useMemo(() => {
    if (analyst) {
      return analyst;
    }

    if (!nexus || !missions) {
      return DEFAULT_STATS;
    }

    const rank = getRankFromXp(nexus.xp);
    const completedMissions = missions.completedSlugs.length;
    const totalMissions = missions.missions.length;
    const completionPercentage =
      totalMissions > 0
        ? Math.round((completedMissions / totalMissions) * 100)
        : 0;

    return {
      rank,
      xp: nexus.xp,
      completedMissions,
      totalMissions,
      completionPercentage,
    };
  }, [analyst, missions, nexus]);
}
