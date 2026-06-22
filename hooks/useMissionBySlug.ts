"use client";

import { useMemo } from "react";

import { useMissions, useMissionsStatus } from "@/hooks/useMissions";
import type { PublicMission } from "@/types/PublicMission";

export function useMissionBySlug(slug: string): {
  mission: PublicMission | null;
  loading: boolean;
  error: string | null;
} {
  const missions = useMissions();
  const { loading, error } = useMissionsStatus();

  const mission = useMemo(
    () => missions.find(item => item.slug === slug) ?? null,
    [missions, slug]
  );

  return {
    mission,
    loading,
    error
  };
}
