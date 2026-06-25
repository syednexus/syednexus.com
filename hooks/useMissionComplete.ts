"use client";

import { useCallback, useRef, useState } from "react";

import { useSound } from "@/context/SoundContext";
import { useNexus } from "@/context/NexusContext";
import { useWorldOptional } from "@/context/WorldContext";
import { refreshAppData } from "@/lib/refreshAppData";
import { resolveOrganizationId } from "@/lib/world/organizations";
import { parseWorldMissionMeta } from "@/lib/world/worldConfig";
import type { PublicMission } from "@/types/PublicMission";
import type { MissionCompleteResult, MissionProgress } from "@/types/mission";

type MissionCompleteResponse = {
  success: boolean;
  xpAwarded?: number;
  alreadyCompleted?: boolean;
  explanation?: string | null;
  error?: string;
  progress: MissionProgress;
  analyst: {
    xp: number;
    rank: string;
    completed: number;
    next: number;
    progress: number;
  };
  newlyUnlocked: Array<{
    id: number;
    name: string;
    description: string;
    icon: string | null;
  }>;
};

type CompletePayload = {
  missionId: number;
  answer: string;
  worldContext?: {
    completedTasks: number[];
    evidence: string[];
  };
};

async function completeMission(payload: CompletePayload): Promise<MissionCompleteResponse> {
  const res = await fetch("/api/missions/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = (await res.json()) as MissionCompleteResponse;

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? "Mission completion failed");
  }

  return data;
}

export function useMissionComplete(mission: PublicMission | null) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [debrief, setDebrief] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const { playSound, triggerVisual } = useSound();
  const { celebrateAchievement } = useNexus();
  const world = useWorldOptional();

  const submit = useCallback(async (): Promise<MissionCompleteResult> => {
    if (!mission) {
      const message = "ACCESS DENIED ❌ MISSION NOT LOADED";
      setResult(message);
      return { success: false, message };
    }

    if (submitLockRef.current || submitting || completed) {
      return { success: false, message: "ACCESS DENIED ❌ SUBMISSION IN PROGRESS" };
    }

    if (!answer.trim()) {
      const message = "ACCESS DENIED ❌ SUBMIT YOUR FINDING";
      setResult(message);
      playSound("answer.wrong");
      triggerVisual("error");
      return { success: false, message };
    }

    submitLockRef.current = true;
    setSubmitting(true);

    try {
      const snapshot = world?.getRoomSnapshot(mission.slug);
      const response = await completeMission({
        missionId: mission.id,
        answer: answer.trim(),
        worldContext: snapshot
          ? { completedTasks: snapshot.completedTaskIds, evidence: snapshot.evidence }
          : undefined
      });

      const xpAwarded = response.xpAwarded ?? 0;

      if (xpAwarded > 0) {
        const meta = parseWorldMissionMeta(mission);
        world?.recordRoomComplete(
          mission.slug,
          resolveOrganizationId(mission),
          mission.difficulty,
          snapshot?.evidence ?? [],
          answer.trim(),
          meta.chainId && meta.chainOutputKey
            ? { chainId: meta.chainId, chainOutputKey: meta.chainOutputKey }
            : undefined
        );
      }

      if (response.explanation) {
        setDebrief(response.explanation);
      }

      const message =
        xpAwarded > 0
          ? `ACCESS GRANTED ✅ +${xpAwarded} XP SAVED`
          : "ACCESS GRANTED ✅ MISSION ALREADY LOGGED";

      setResult(message);
      setCompleted(true);
      playSound("answer.correct");
      playSound("mission.complete");
      triggerVisual("success");

      if (xpAwarded > 0) {
        celebrateAchievement({
          id: `mission-${mission.id}`,
          title: "Incident Closed",
          description: `${mission.title} — +${xpAwarded} XP logged`,
          icon: "✓"
        });
      }

      window.dispatchEvent(new Event("nexus-achievements-refresh"));
      refreshAppData();

      return { success: true, message };
    } catch (err) {
      const message =
        err instanceof Error && err.message === "Incorrect answer"
          ? "ACCESS DENIED ❌ TRY AGAIN"
          : "ACCESS DENIED ❌ SAVE FAILED";
      setResult(message);
      playSound("answer.wrong");
      playSound("mission.failed");
      triggerVisual("error");
      return { success: false, message };
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  }, [mission, answer, playSound, triggerVisual, celebrateAchievement, world, submitting, completed]);

  const reset = useCallback(() => {
    setAnswer("");
    setResult("");
    setCompleted(false);
    setDebrief(null);
  }, []);

  return {
    answer,
    setAnswer,
    result,
    submitting,
    completed,
    debrief,
    submit,
    reset
  };
}
