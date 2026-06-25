"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

import { snapshotFromPayload } from "@/context/EnvironmentState";
import { useWorld } from "@/context/WorldContext";
import { resolveOrganizationId } from "@/lib/world/organizations";
import type { PublicMission } from "@/types/PublicMission";
import type { RoomConfig, RoomTask } from "@/lib/roomConfig";
import { parseRoomConfig } from "@/lib/roomConfig";
import {
  createAction,
  matchesValidator,
  type ActionType,
  type TrackedAction
} from "@/lib/actionTracking";
import { actionToToolName } from "@/context/EnvironmentState";
import type { WorkspaceFile, WorkspaceLayout, WorkspaceWindowId } from "@/lib/workspaceConfig";
import { uniqueWindowIds } from "@/lib/workspaceConfig";
import { playSound } from "@/lib/audio/nexusAudio";

export type WorkstationContextValue = {
  mission: PublicMission;
  layout: WorkspaceLayout;
  room: RoomConfig;
  tasks: RoomTask[];
  completedTaskIds: number[];
  actions: TrackedAction[];
  trackAction: (type: ActionType, value: string) => void;
  completed: boolean;
  submitting: boolean;
  result: string;
  notes: string;
  setNotes: (value: string) => void;
  evidence: string[];
  addEvidence: (item: string) => void;
  selectedFile: WorkspaceFile | null;
  setSelectedFile: (file: WorkspaceFile | null) => void;
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
  completeLab: (answer: string) => void;
  elapsedSeconds: number;
  analystAnswer: string;
  setAnalystAnswer: (value: string) => void;
  submitAnalystAnswer: () => void;
  mentorHint: string | null;
  setMentorHint: (hint: string | null) => void;
};

const WorkstationContext = createContext<WorkstationContextValue | null>(null);

export function useWorkstation() {
  const ctx = useContext(WorkstationContext);
  if (!ctx) throw new Error("useWorkstation must be used within WorkstationProvider");
  return ctx;
}

type ProviderProps = {
  mission: PublicMission;
  layout: WorkspaceLayout;
  completed: boolean;
  submitting: boolean;
  result: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  analystAnswer?: string;
  onAnalystAnswerChange?: (value: string) => void;
  onAnalystSubmit?: () => void;
  children: ReactNode;
};

export function WorkstationProvider({
  mission,
  layout,
  completed,
  submitting,
  result,
  onAnswerChange,
  onSubmit,
  analystAnswer: externalAnswer,
  onAnalystAnswerChange,
  onAnalystSubmit,
  children
}: ProviderProps) {
  const world = useWorld();
  const room = useMemo(() => parseRoomConfig(mission), [mission]);
  const tasks = room.tasks ?? [];
  const restored = useMemo(() => world.getRoomSnapshot(mission.slug), [world, mission.slug]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [notes, setNotes] = useState(restored?.notes ?? "");
  const [evidence, setEvidence] = useState<string[]>(restored?.evidence ?? []);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(layout.files[0] ?? null);
  const [progress, setProgress] = useState(
    restored?.completedTaskIds.length
      ? Math.min(95, Math.round((restored.completedTaskIds.length / (tasks.length || 1)) * 100))
      : 0
  );
  const [internalAnswer, setInternalAnswer] = useState("");
  const [actions, setActions] = useState<TrackedAction[]>(restored?.actions ?? []);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>(restored?.completedTaskIds ?? []);
  const [mentorHint, setMentorHint] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const enteredRef = useRef(false);
  const autoSubmitRef = useRef(false);
  const submitPendingRef = useRef(false);
  const completedTaskIdsRef = useRef(completedTaskIds);
  const pendingTaskRecordsRef = useRef<number[]>([]);
  const [taskRecordsTick, setTaskRecordsTick] = useState(0);

  completedTaskIdsRef.current = completedTaskIds;

  useEffect(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    world.recordRoomEnter(mission.slug, resolveOrganizationId(mission));
  }, [mission, world]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      world.saveRoomSnapshot(
        snapshotFromPayload(mission.slug, {
          notes,
          evidence,
          actions,
          completedTaskIds,
          desktopPreset: world.desktopPreset
        }, world.getRoomSnapshot(mission.slug))
      );
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [notes, evidence, actions, completedTaskIds, mission.slug, world.desktopPreset, world]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startTime]);

  const analystAnswer = externalAnswer ?? internalAnswer;
  const setAnalystAnswer = onAnalystAnswerChange ?? setInternalAnswer;

  const completeLab = useCallback(
    (answer: string) => {
      if (completed || submitting || submitPendingRef.current) return;
      submitPendingRef.current = true;
      onAnswerChange(answer);
      setProgress(100);
      window.setTimeout(() => {
        onSubmit();
        submitPendingRef.current = false;
      }, 50);
    },
    [completed, submitting, onAnswerChange, onSubmit]
  );

  const evaluateTasks = useCallback((nextActions: TrackedAction[]) => {
    const current = completedTaskIdsRef.current;
    const newlyDone: number[] = [];

    for (const task of tasks) {
      if (current.includes(task.id)) continue;
      if (matchesValidator(task.validator, nextActions)) {
        newlyDone.push(task.id);
      }
    }

    if (newlyDone.length === 0) return;

    const merged = [...current, ...newlyDone];
    completedTaskIdsRef.current = merged;
    pendingTaskRecordsRef.current.push(...newlyDone);
    setCompletedTaskIds(merged);
    setProgress(Math.min(95, Math.round((merged.length / (tasks.length || 1)) * 100)));
    setTaskRecordsTick(tick => tick + 1);
  }, [tasks]);

  useEffect(() => {
    evaluateTasks(actions);
  }, [actions, evaluateTasks]);

  useEffect(() => {
    if (pendingTaskRecordsRef.current.length === 0) return;

    const toRecord = [...pendingTaskRecordsRef.current];
    pendingTaskRecordsRef.current = [];

    for (const id of toRecord) {
      world.recordTaskComplete(mission.slug, id);
    }
  }, [taskRecordsTick, mission.slug, world]);

  useEffect(() => {
    if (completed || submitting || tasks.length === 0 || autoSubmitRef.current) return;
    const allDone = tasks.every(task => completedTaskIds.includes(task.id));
    if (allDone && analystAnswer.trim()) {
      autoSubmitRef.current = true;
      completeLab(analystAnswer.trim());
    }
  }, [completedTaskIds, tasks, completed, submitting, analystAnswer, completeLab]);

  const trackAction = useCallback(
    (type: ActionType, value: string) => {
      const tool = actionToToolName(createAction(type, value));
      if (tool) world.recordToolUse(mission.slug, tool);
      setActions(current => [...current, createAction(type, value)]);
    },
    [mission.slug, world]
  );

  const addEvidence = useCallback(
    (item: string) => {
      setEvidence(current => (current.includes(item) ? current : [...current, item]));
      trackAction("evidence", item);
      setProgress(current => Math.min(95, current + 8));
      playSound("evidence.collect");
    },
    [trackAction]
  );

  const submitAnalystAnswer = useCallback(() => {
    if (completed || submitting || submitPendingRef.current || !analystAnswer.trim()) return;
    trackAction("finding_submitted", analystAnswer);
    completeLab(analystAnswer.trim());
  }, [analystAnswer, trackAction, completeLab, completed, submitting]);

  const value = useMemo(
    () => ({
      mission,
      layout,
      room,
      tasks,
      completedTaskIds,
      actions,
      trackAction,
      completed,
      submitting,
      result,
      notes,
      setNotes,
      evidence,
      addEvidence,
      selectedFile,
      setSelectedFile,
      progress,
      setProgress,
      completeLab,
      elapsedSeconds,
      analystAnswer,
      setAnalystAnswer,
      submitAnalystAnswer,
      mentorHint,
      setMentorHint
    }),
    [
      mission,
      layout,
      room,
      tasks,
      completedTaskIds,
      actions,
      trackAction,
      completed,
      submitting,
      result,
      notes,
      evidence,
      addEvidence,
      selectedFile,
      progress,
      completeLab,
      elapsedSeconds,
      analystAnswer,
      setAnalystAnswer,
      submitAnalystAnswer,
      mentorHint
    ]
  );

  return <WorkstationContext.Provider value={value}>{children}</WorkstationContext.Provider>;
}

export type ManagedWindow = {
  instanceId: string;
  id: WorkspaceWindowId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
};

export const DEFAULT_WINDOW_SIZES: Record<WorkspaceWindowId, { width: number; height: number }> = {
  terminal: { width: 520, height: 340 },
  browser: { width: 480, height: 400 },
  files: { width: 400, height: 360 },
  siem: { width: 560, height: 420 },
  wireshark: { width: 540, height: 380 },
  burp: { width: 500, height: 360 },
  metasploit: { width: 520, height: 400 },
  inbox: { width: 420, height: 360 },
  slack: { width: 400, height: 380 },
  tickets: { width: 440, height: 360 },
  nmap: { width: 460, height: 340 },
  network: { width: 500, height: 380 }
};

export function createInitialWindows(ids: WorkspaceWindowId[]): ManagedWindow[] {
  return uniqueWindowIds(ids).map((id, index) => ({
    instanceId: `${id}-${index}`,
    id,
    x: 24 + (index % 3) * 36,
    y: 24 + index * 28,
    width: DEFAULT_WINDOW_SIZES[id].width,
    height: DEFAULT_WINDOW_SIZES[id].height,
    zIndex: index + 1,
    minimized: false
  }));
}
