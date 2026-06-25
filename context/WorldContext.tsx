"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import { useAnalyst } from "@/context/AnalystContext";
import { useMissions } from "@/context/MissionsContext";
import { useSession } from "next-auth/react";
import {
  createAnalyticsEvent,
  summarizeAnalytics,
  trimAnalytics,
  type AnalyticsSummary
} from "@/lib/world/analytics";
import {
  advanceCareerDay,
  createCareerWeek,
  endWeekReview,
  isFriday,
  resolveCareerEvent,
  weekdayLabel
} from "@/lib/world/careerWeek";
import {
  addCredits,
  canAfford,
  CREDIT_COSTS,
  missionCreditReward,
  spendCredits,
  type CreditSpendReason
} from "@/lib/world/credits";
import type { DesktopPresetId } from "@/lib/world/desktopPresets";
import {
  canUnlockContract,
  computeReputation,
  getReputationTier,
  ORGANIZATIONS,
  reputationLabel,
  resolveOrganizationId,
  type OrganizationId
} from "@/lib/world/organizations";
import {
  createDefaultWorldState,
  getActiveSlotState,
  loadWorldState,
  saveWorldState,
  slotLabel
} from "@/lib/world/saveSlots";
import type {
  CareerWeekState,
  RoomEnvironmentSnapshot,
  SaveSlotId,
  WorldPersistedState
} from "@/lib/world/types";
import {
  isOwnerSuperMode
} from "@/lib/world/ownerSuperMode";

type WorldContextValue = {
  state: WorldPersistedState;
  activeSlot: SaveSlotId;
  credits: number;
  reputation: number;
  reputationTier: ReturnType<typeof getReputationTier>;
  reputationLabel: string;
  careerWeek: CareerWeekState | null;
  desktopPreset: DesktopPresetId | null;
  analyticsSummary: AnalyticsSummary;
  setActiveSlot: (slot: SaveSlotId) => void;
  setDesktopPreset: (preset: DesktopPresetId | null) => void;
  getRoomSnapshot: (missionSlug: string) => RoomEnvironmentSnapshot | null;
  saveRoomSnapshot: (snapshot: RoomEnvironmentSnapshot) => void;
  recordRoomEnter: (missionSlug: string, organizationId: string) => void;
  recordRoomComplete: (
    missionSlug: string,
    organizationId: string,
    difficulty: string,
    evidence: string[],
    analystAnswer: string,
    chainMeta?: { chainId?: string; chainOutputKey?: string }
  ) => void;
  recordRoomAbandon: (missionSlug: string) => void;
  recordToolUse: (missionSlug: string, tool: string) => void;
  recordTaskComplete: (missionSlug: string, taskId: number) => void;
  spendCreditsFor: (reason: CreditSpendReason) => boolean;
  isSuperMode: boolean;
  isChainUnlockedFor: (prerequisiteSlug?: string) => boolean;
  getChainArtifacts: () => WorldPersistedState["slots"]["A"]["chainArtifacts"];
  resolveCareerEventById: (eventId: string) => void;
  advanceCareerDay: () => void;
  finalizeCareerWeek: () => void;
  initCareerWeekIfNeeded: () => void;
  unlockContract: (organizationId: WorldPersistedState["slots"]["A"]["unlockedContracts"][number]) => void;
  slotLabel: (slot: SaveSlotId) => string;
};

const WorldContext = createContext<WorldContextValue | null>(null);

export function useWorld() {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used within WorldProvider");
  return ctx;
}

export function useWorldOptional() {
  return useContext(WorldContext);
}

function updateSlot(
  state: WorldPersistedState,
  updater: (slot: WorldPersistedState["slots"]["A"]) => WorldPersistedState["slots"]["A"]
): WorldPersistedState {
  const active = state.activeSlot;
  return {
    ...state,
    slots: {
      ...state.slots,
      [active]: updater(state.slots[active])
    }
  };
}

export function WorldProvider({ children }: { children: ReactNode }) {
  const analyst = useAnalyst();
  const missions = useMissions();
  const { data: session } = useSession();
  const [state, setState] = useState<WorldPersistedState>(() => createDefaultWorldState());
  const hydrated = useRef(false);

  const isSuperMode = isOwnerSuperMode(session?.user?.role);

  useEffect(() => {
    setState(loadWorldState());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveWorldState(state);
  }, [state]);

  const slot = getActiveSlotState(state);
  const reputation = useMemo(
    () => computeReputation(analyst.xp, analyst.completed),
    [analyst.xp, analyst.completed]
  );
  const reputationTier = getReputationTier(reputation);

  const persist = useCallback((updater: (current: WorldPersistedState) => WorldPersistedState) => {
    setState(current => updater(current));
  }, []);

  const setActiveSlot = useCallback((next: SaveSlotId) => {
    persist(current => ({ ...current, activeSlot: next }));
  }, [persist]);

  const [globalPreset, setGlobalPreset] = useState<DesktopPresetId | null>(null);

  const setDesktopPreset = useCallback((preset: DesktopPresetId | null) => {
    setGlobalPreset(preset);
  }, []);

  const getRoomSnapshot = useCallback(
    (missionSlug: string) => slot.rooms[missionSlug] ?? null,
    [slot.rooms]
  );

  const saveRoomSnapshot = useCallback(
    (snapshot: RoomEnvironmentSnapshot) => {
      persist(current =>
        updateSlot(current, s => ({
          ...s,
          rooms: { ...s.rooms, [snapshot.missionSlug]: snapshot }
        }))
      );
    },
    [persist]
  );

  const pushAnalytics = useCallback(
    (event: ReturnType<typeof createAnalyticsEvent>) => {
      persist(current =>
        updateSlot(current, s => ({
          ...s,
          analytics: trimAnalytics([...s.analytics, event])
        }))
      );
    },
    [persist]
  );

  const recordRoomEnter = useCallback(
    (missionSlug: string, organizationId: string) => {
      pushAnalytics(
        createAnalyticsEvent("room_enter", { missionSlug, organizationId: organizationId as never })
      );
    },
    [pushAnalytics]
  );

  const recordRoomComplete = useCallback(
    (
      missionSlug: string,
      organizationId: string,
      difficulty: string,
      evidence: string[],
      analystAnswer: string,
      chainMeta?: { chainId?: string; chainOutputKey?: string }
    ) => {
      const reward = missionCreditReward(difficulty);
      const chainValue =
        analystAnswer.trim() ||
        evidence[evidence.length - 1] ||
        `ioc-${missionSlug}`;

      persist(current =>
        updateSlot(current, s => {
          const completedRooms = s.completedRooms.includes(missionSlug)
            ? s.completedRooms
            : [...s.completedRooms, missionSlug];

          let chainArtifacts = s.chainArtifacts;
          if (chainMeta?.chainId && chainMeta.chainOutputKey) {
            const artifact = {
              chainId: chainMeta.chainId,
              missionSlug,
              outputKey: chainMeta.chainOutputKey,
              outputValue: chainValue,
              createdAt: Date.now()
            };
            chainArtifacts = [
              ...s.chainArtifacts.filter(
                item => !(item.chainId === artifact.chainId && item.missionSlug === missionSlug)
              ),
              artifact
            ];
          }

          const org = organizationId as OrganizationId;
          const orgDef = ORGANIZATIONS[org];
          const unlockedContracts =
            orgDef &&
            canUnlockContract(orgDef, reputation) &&
            !s.unlockedContracts.includes(org)
              ? [...s.unlockedContracts, org]
              : s.unlockedContracts;

          return {
            ...s,
            credits: addCredits(s.credits, reward),
            completedRooms,
            chainArtifacts,
            unlockedContracts,
            analytics: trimAnalytics([
              ...s.analytics,
              createAnalyticsEvent("room_complete", { missionSlug, organizationId: org })
            ])
          };
        })
      );
    },
    [persist, reputation]
  );

  const recordRoomAbandon = useCallback(
    (missionSlug: string) => {
      pushAnalytics(createAnalyticsEvent("room_abandon", { missionSlug }));
    },
    [pushAnalytics]
  );

  const recordToolUse = useCallback(
    (missionSlug: string, tool: string) => {
      pushAnalytics(
        createAnalyticsEvent("tool_use", { missionSlug, payload: { tool } })
      );
    },
    [pushAnalytics]
  );

  const recordTaskComplete = useCallback(
    (missionSlug: string, taskId: number) => {
      pushAnalytics(
        createAnalyticsEvent("task_complete", {
          missionSlug,
          payload: { taskId }
        })
      );
    },
    [pushAnalytics]
  );

  const spendCreditsFor = useCallback(
    (reason: CreditSpendReason) => {
      if (isSuperMode) return true;

      const cost = CREDIT_COSTS[reason];
      if (!canAfford(slot.credits, cost)) return false;
      persist(current =>
        updateSlot(current, s => ({
          ...s,
          credits: spendCredits(s.credits, cost),
          analytics: trimAnalytics([
            ...s.analytics,
            createAnalyticsEvent("hint_purchased", { payload: { reason, cost } })
          ])
        }))
      );
      return true;
    },
    [isSuperMode, persist, slot.credits]
  );

  const isChainUnlockedFor = useCallback(
    (prerequisiteSlug?: string) => {
      if (isSuperMode) return true;
      if (!prerequisiteSlug) return true;
      const serverSlugs = missions
        .filter(mission => analyst.completedMissionIds.includes(mission.id))
        .map(mission => mission.slug);
      return serverSlugs.includes(prerequisiteSlug);
    },
    [isSuperMode, missions, analyst.completedMissionIds]
  );

  const getChainArtifacts = useCallback(() => slot.chainArtifacts, [slot.chainArtifacts]);

  const ensureCareerWeek = useCallback((): CareerWeekState => {
    if (slot.careerWeek && slot.careerWeek.weekId === createCareerWeek(reputation).weekId) {
      return slot.careerWeek;
    }
    return createCareerWeek(reputation);
  }, [slot.careerWeek, reputation]);

  const careerWeek = slot.careerWeek ?? null;

  const resolveCareerEventById = useCallback(
    (eventId: string) => {
      const week = ensureCareerWeek();
      const next = resolveCareerEvent(week, eventId);
      persist(current => updateSlot(current, s => ({ ...s, careerWeek: next })));
    },
    [ensureCareerWeek, persist]
  );

  const advanceCareerDayFn = useCallback(() => {
    const week = ensureCareerWeek();
    persist(current =>
      updateSlot(current, s => ({
        ...s,
        careerWeek: advanceCareerDay(week, reputation)
      }))
    );
  }, [ensureCareerWeek, persist, reputation]);

  const initCareerWeekIfNeeded = useCallback(() => {
    if (slot.careerWeek) return;
    const week = createCareerWeek(reputation);
    persist(current => updateSlot(current, s => ({ ...s, careerWeek: week })));
  }, [slot.careerWeek, persist, reputation]);

  const finalizeCareerWeek = useCallback(() => {
    const week = ensureCareerWeek();
    if (!isFriday(week)) return;
    const review = endWeekReview(week.performanceScore);
    persist(current =>
      updateSlot(current, s => ({
        ...s,
        careerWeek: { ...week, managerReview: review },
        credits: addCredits(s.credits, 12)
      }))
    );
  }, [ensureCareerWeek, persist]);

  const unlockContract = useCallback(
    (organizationId: WorldPersistedState["slots"]["A"]["unlockedContracts"][number]) => {
      persist(current =>
        updateSlot(current, s => ({
          ...s,
          unlockedContracts: s.unlockedContracts.includes(organizationId)
            ? s.unlockedContracts
            : [...s.unlockedContracts, organizationId]
        }))
      );
    },
    [persist]
  );

  const analyticsSummary = useMemo(() => summarizeAnalytics(slot.analytics), [slot.analytics]);

  const value = useMemo(
    () => ({
      state,
      activeSlot: state.activeSlot,
      credits: slot.credits,
      reputation,
      reputationTier,
      reputationLabel: reputationLabel(reputationTier),
      careerWeek,
      desktopPreset: globalPreset,
      analyticsSummary,
      setActiveSlot,
      setDesktopPreset,
      getRoomSnapshot,
      saveRoomSnapshot,
      recordRoomEnter,
      recordRoomComplete,
      recordRoomAbandon,
      recordToolUse,
      recordTaskComplete,
      spendCreditsFor,
      isSuperMode,
      isChainUnlockedFor,
      getChainArtifacts,
      resolveCareerEventById,
      advanceCareerDay: advanceCareerDayFn,
      finalizeCareerWeek,
      initCareerWeekIfNeeded,
      unlockContract,
      slotLabel
    }),
    [
      state,
      slot.credits,
      slot.careerWeek,
      reputation,
      reputationTier,
      careerWeek,
      globalPreset,
      analyticsSummary,
      setActiveSlot,
      setDesktopPreset,
      getRoomSnapshot,
      saveRoomSnapshot,
      recordRoomEnter,
      recordRoomComplete,
      recordRoomAbandon,
      recordToolUse,
      recordTaskComplete,
      spendCreditsFor,
      isSuperMode,
      isChainUnlockedFor,
      getChainArtifacts,
      resolveCareerEventById,
      advanceCareerDayFn,
      finalizeCareerWeek,
      initCareerWeekIfNeeded,
      unlockContract
    ]
  );

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

export { weekdayLabel, resolveOrganizationId };
