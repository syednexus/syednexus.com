"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { missions as missionCatalog } from "@/data/missions";
import { useNexus } from "@/context/NexusContext";
import { Mission, MissionType } from "@/types/mission";

const STORAGE_KEY = "nexus-completed-missions";

type MissionsContextType = {
  missions: Mission[];
  completedSlugs: string[];
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;
  getMissionBySlug: (slug: string) => Mission | undefined;
  getMissionsByTypes: (types: MissionType[]) => Mission[];
  isMissionCompleted: (slug: string) => boolean;
  completeMission: (slug: string) => void;
};

const MissionsContext = createContext<MissionsContextType | null>(null);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const { addXP } = useNexus();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedSlugs(JSON.parse(stored) as string[]);
      }
    } catch {
      setCompletedSlugs([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSlugs));
  }, [completedSlugs, hydrated]);

  const getMissionBySlug = useCallback((slug: string) => {
    return missionCatalog.find((mission) => mission.slug === slug);
  }, []);

  const getMissionsByTypes = useCallback((types: MissionType[]) => {
    const allowed = new Set(types);
    return missionCatalog.filter((mission) => allowed.has(mission.type));
  }, []);

  const isMissionCompleted = useCallback(
    (slug: string) => completedSlugs.includes(slug),
    [completedSlugs],
  );

  const completeMission = useCallback(
    (slug: string) => {
      const mission = getMissionBySlug(slug);
      if (!mission || completedSlugs.includes(slug)) {
        return;
      }

      setCompletedSlugs((previous) => [...previous, slug]);
      addXP(mission.xpReward);
    },
    [addXP, completedSlugs, getMissionBySlug],
  );

  const value = useMemo(
    () => ({
      missions: missionCatalog,
      completedSlugs,
      activeMission,
      setActiveMission,
      getMissionBySlug,
      getMissionsByTypes,
      isMissionCompleted,
      completeMission,
    }),
    [
      activeMission,
      completeMission,
      completedSlugs,
      getMissionBySlug,
      getMissionsByTypes,
      isMissionCompleted,
    ],
  );

  return (
    <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionsContext);

  if (!context) {
    throw new Error("useMissions must be used inside MissionsProvider");
  }

  return context;
}

export function useMissionsOptional() {
  return useContext(MissionsContext);
}
