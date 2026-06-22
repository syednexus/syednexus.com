"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { useWorld } from "@/context/WorldContext";
import { validatorLabel } from "@/lib/actionTracking";
import { getOrganization } from "@/lib/world/organizations";
import { parseWorldMissionMeta } from "@/lib/world/worldConfig";
import { CREDIT_COSTS } from "@/lib/world/credits";

export default function NexusMentor() {
  const { mission, tasks, completedTaskIds, actions, evidence, notes, setMentorHint, mentorHint } =
    useWorkstation();
  const world = useWorld();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setMentorHint(data.reply ?? data.error ?? "Mentor unavailable — try the task hint in the left panel.");
    } catch {
      setMentorHint(
        nextTask?.hint ??
          `Try: ${nextTask ? validatorLabel(nextTask.validator) : "Review room objectives and use workstation tools."}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-purple-900/40 bg-purple-950/10">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between px-4 py-2 text-xs text-purple-300"
      >
        <span>◈ Nexus Mentor</span>
        <span>{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="space-y-2 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
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
            <p className="rounded border border-purple-900/40 bg-black/40 p-2 text-[11px] text-purple-200/90">
              {mentorHint}
            </p>
          )}
          <p className="text-[10px] text-gray-700">
            Story-aware mentor · hints cost {CREDIT_COSTS.hint} CR · XP unchanged
          </p>
        </div>
      )}
    </div>
  );
}
