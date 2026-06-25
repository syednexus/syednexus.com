"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { useWorld } from "@/context/WorldContext";
import { validatorLabel } from "@/lib/actionTracking";
import { getOrganization } from "@/lib/world/organizations";
import { parseWorldMissionMeta } from "@/lib/world/worldConfig";
import { CREDIT_COSTS } from "@/lib/world/credits";
import { useSound } from "@/context/SoundContext";
import { stopAiThinking } from "@/lib/audio/nexusAudio";

export default function NexusMentor() {
  const { mission, tasks, completedTaskIds, actions, evidence, notes, setMentorHint, mentorHint } =
    useWorkstation();
  const world = useWorld();
  const { playSound, triggerVisual } = useSound();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const nextTask = tasks.find(task => !completedTaskIds.includes(task.id));
  const org = getOrganization(mission);
  const meta = parseWorldMissionMeta(mission);

  async function askMentor(mode: "hint" | "explain" | "review") {
    const creditReason = mode === "hint" ? "hint" : mode === "explain" ? "mentorExplain" : "hint";
    if (!world.spendCreditsFor(creditReason as "hint")) {
      setMentorHint(`Need ${CREDIT_COSTS[creditReason as keyof typeof CREDIT_COSTS]} CR for this guidance.`);
      return;
    }

    setLoading(true);
    setMentorHint(null);
    playSound("ai.thinking");

    const context = [
      `Organization: ${org.name} (${org.sector})`,
      `Room: ${mission.title} (${mission.slug})`,
      meta.chainId ? `Incident chain: ${meta.chainId} step ${meta.chainStep ?? "?"}` : "",
      `Current task: ${nextTask?.objective ?? "Room complete"}`,
      `Validator hint: ${nextTask ? validatorLabel(nextTask.validator) : "none"}`,
      `Evidence collected: ${evidence.join(", ") || "none"}`,
      `Analyst notes: ${notes.slice(0, 200) || "none"}`,
      `Actions so far: ${actions.slice(-8).map(action => `${action.type}:${action.value}`).join(", ") || "none"}`,
      `Reputation tier: ${world.reputationLabel}`
    ]
      .filter(Boolean)
      .join("\n");

    const prompts: Record<string, string> = {
      hint: `Give a progressive hint without revealing the direct answer. ${context}`,
      explain: `Explain the security concept for this lab step in 2-3 sentences. ${context}`,
      review: `Review what the student did and suggest the next investigative step. Do not give the final answer. ${context}`
    };

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompts[mode] })
      });
      const data = await response.json();
      stopAiThinking();
      setMentorHint(data.reply ?? data.error ?? "Mentor unavailable — try the task hint in the left panel.");
      playSound(data.reply ? "ai.response" : "ai.error");
      if (data.reply) triggerVisual("success");
    } catch {
      stopAiThinking();
      setMentorHint(
        nextTask?.hint ??
          `Try: ${nextTask ? validatorLabel(nextTask.validator) : "Review room objectives and use workstation tools."}`
      );
      playSound("ai.error");
      triggerVisual("error");
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    if (!mentorHint) return;

    try {
      await navigator.clipboard.writeText(mentorHint);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function clearResponse() {
    setMentorHint(null);
    setCopied(false);
  }

  return (
    <div className="w-full min-w-0 max-w-full shrink-0 overflow-hidden border-t border-purple-900/40 bg-purple-950/10">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          playSound(next ? "ai.open" : "ui.panel.close");
        }}
        className="flex w-full min-w-0 items-center justify-between px-4 py-2 text-xs text-purple-300"
      >
        <span className="truncate">◈ Nexus Mentor</span>
        <span className="shrink-0">{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="w-full min-w-0 max-w-full space-y-2 overflow-hidden px-4 pb-4">
          <div className="flex min-w-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => askMentor("hint")}
              disabled={loading}
              className="border border-purple-700 px-2 py-1 text-[10px] text-purple-300"
            >
              Hint
            </button>
            <button
              type="button"
              onClick={() => askMentor("explain")}
              disabled={loading}
              className="border border-purple-700 px-2 py-1 text-[10px] text-purple-300"
            >
              Explain
            </button>
            <button
              type="button"
              onClick={() => askMentor("review")}
              disabled={loading}
              className="border border-purple-700 px-2 py-1 text-[10px] text-purple-300"
            >
              Review
            </button>
          </div>
          {loading && <p className="text-[10px] text-gray-600">Thinking...</p>}
          {mentorHint && (
            <div className="max-h-[40vh] w-full min-w-0 max-w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded border border-purple-900/40 bg-black/40 p-2 lg:max-h-[30vh]">
              <p className="whitespace-pre-wrap break-words text-[11px] text-purple-200/90 [overflow-wrap:anywhere]">
                {mentorHint}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void copyResponse();
                  }}
                  className="border border-purple-800 px-2 py-0.5 text-[10px] text-purple-300 hover:bg-purple-950/40"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={clearResponse}
                  className="border border-purple-800 px-2 py-0.5 text-[10px] text-purple-300 hover:bg-purple-950/40"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          <p className="text-[10px] text-gray-700">
            Story-aware mentor · hints cost {CREDIT_COSTS.hint} CR · XP unchanged
          </p>
        </div>
      )}
    </div>
  );
}
