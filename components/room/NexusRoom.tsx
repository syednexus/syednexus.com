"use client";

import { useEffect, useState } from "react";

import type { PracticalMissionProps } from "@/components/engine/PracticalMissionProps";
import NexusWorkstation from "@/components/workspace/NexusWorkstation";
import ReportBuilder from "@/components/report/ReportBuilder";
import WorldHud from "@/components/world/WorldHud";
import { useWorld } from "@/context/WorldContext";
import { parseRoomConfig } from "@/lib/roomConfig";
import { chainPositionLabel, isChainUnlocked } from "@/lib/world/incidentChain";
import { useAnalyst } from "@/context/AnalystContext";
import { useMissions } from "@/context/MissionsContext";
import { getDifficultyModifier, getOrganization } from "@/lib/world/organizations";
import { parseWorldMissionMeta } from "@/lib/world/worldConfig";

export type NexusRoomProps = PracticalMissionProps & {
  variant?: "practical" | "soc";
  analystAnswer?: string;
  onAnalystAnswerChange?: (value: string) => void;
  onAnalystSubmit?: () => void;
};

type Phase = "intro" | "lab" | "complete";

export default function NexusRoom(props: NexusRoomProps) {
  const { mission, completed, result } = props;
  const room = parseRoomConfig(mission);
  const world = useWorld();
  const analyst = useAnalyst();
  const missions = useMissions();
  const serverCompletedSlugs = missions
    .filter(m => analyst.completedMissionIds.includes(m.id))
    .map(m => m.slug);
  const org = getOrganization(mission);
  const meta = parseWorldMissionMeta(mission);
  const chainLabel = chainPositionLabel(mission);
  const chainReady = isChainUnlocked(mission, serverCompletedSlugs);
  const difficultyMod = getDifficultyModifier(world.reputation);
  const [phase, setPhase] = useState<Phase>(completed ? "complete" : "intro");

  useEffect(() => {
    if (completed || result.includes("GRANTED")) {
      setPhase("complete");
    }
  }, [completed, result]);

  if (phase === "intro") {
    return (
      <section className="mt-6 rounded-xl border border-green-900/60 bg-black/40 p-4 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-cyan-500">Nexus Room · {org.name}</p>
        <h2 className="mt-3 text-2xl font-bold text-green-300 sm:text-3xl">{room.title}</h2>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Client: {org.sector}</span>
          <span>Difficulty: {room.difficulty}</span>
          <span>~{room.estimatedMinutes} min</span>
          <span>{mission.xp} XP</span>
          {chainLabel && <span className="text-purple-400">{chainLabel}</span>}
          <span className="text-amber-500">Incident load: {difficultyMod}</span>
        </div>

        <div className="mt-4">
          <WorldHud />
        </div>

        {!chainReady && meta.prerequisiteSlug && (
          <p className="mt-4 rounded border border-amber-800 bg-amber-950/20 p-3 text-sm text-amber-300">
            Chain locked — complete <strong>{meta.prerequisiteSlug}</strong> first.
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-green-500">Introduction</h3>
            <p className="mt-3 whitespace-pre-wrap text-gray-400">{room.introduction}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-green-500">Learning objectives</h3>
            <ul className="mt-3 list-inside list-disc space-y-1 text-gray-400">
              {room.learningObjectives?.map((item, index) => (
                <li key={`obj-${index}`}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm uppercase tracking-wider text-green-500">Required knowledge</h3>
            <ul className="mt-3 list-inside list-disc space-y-1 text-gray-500">
              {room.requiredKnowledge?.map((item, index) => (
                <li key={`req-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm uppercase tracking-wider text-green-500">Tasks</h3>
          <ol className="mt-4 space-y-3">
            {room.tasks?.map(task => (
              <li
                key={task.id}
                className="rounded-lg border border-green-900/40 bg-green-950/10 px-4 py-3 text-sm text-gray-400"
              >
                <span className="text-green-600">Task {task.id}:</span> {task.objective}
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          disabled={!chainReady}
          onClick={() => setPhase("lab")}
          className="mt-10 w-full border border-green-500 px-8 py-3 text-green-400 transition hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          ▶ {chainReady ? "Start room" : "Chain locked"}
        </button>
      </section>
    );
  }

  if (phase === "complete") {
    return (
      <section className="mt-6 space-y-6">
        <div className="rounded-xl border border-green-700 bg-green-950/20 p-6">
          <p className="text-xs uppercase text-green-500">Room complete</p>
          <h2 className="mt-2 text-2xl font-bold text-green-300">{room.title}</h2>
          <p className="mt-2 text-gray-400">All tasks finished. +{mission.xp} XP</p>
        </div>
        <ReportBuilder mission={mission} />
      </section>
    );
  }

  return <NexusWorkstation {...props} />;
}
