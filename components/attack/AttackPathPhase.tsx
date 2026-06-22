"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import AttackMissionCard from "@/components/attack/AttackMissionCard";
import AttackPathPipeline from "@/components/attack/AttackPathPipeline";
import {
  ATTACK_PATH_PHASES,
  getAttackPathPhase,
  getPathMissions,
  type AttackPathPhaseId
} from "@/lib/labConfig";
import { getDifficultySpread } from "@/lib/attackLabPhases";
import type { Mission } from "@/types/mission";

type AttackPathPhaseProps = {
  phaseId: AttackPathPhaseId;
  missions: Mission[];
  completedIds: Set<number>;
};

function AttackPathPhaseSection({ phaseId, missions, completedIds }: AttackPathPhaseProps) {
  const [expanded, setExpanded] = useState(true);
  const phase = ATTACK_PATH_PHASES.find(item => item.id === phaseId)!;

  const completedCount = missions.filter(m => completedIds.has(m.id)).length;
  const spread = getDifficultySpread(missions);

  return (
    <section className="rounded-xl border border-red-900/70 bg-red-950/10">
      <button
        type="button"
        onClick={() => setExpanded(current => !current)}
        className="flex w-full flex-wrap items-start justify-between gap-4 p-6 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-red-500">
            Step {phase.step} — {phase.title}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-red-300">Interactive Labs</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">{phase.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatPill label="Labs" value={missions.length} />
          <StatPill label="Completed" value={completedCount} />
          <StatPill label="Easy" value={spread.Beginner} />
          <StatPill label="Medium" value={spread.Intermediate} />
          <StatPill label="Hard" value={spread.Advanced} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="border-t border-red-900/50 p-6 pt-4"
        >
          {missions.length === 0 ? (
            <p className="text-center text-gray-500">No labs in this phase yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {missions.map(mission => (
                <AttackMissionCard
                  key={mission.id}
                  mission={mission}
                  completed={completedIds.has(mission.id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-red-900/60 bg-black/40 px-3 py-2 text-center">
      <p className="text-[10px] uppercase text-gray-500">{label}</p>
      <p className="text-lg font-bold text-red-300">{value}</p>
    </div>
  );
}

export { AttackPathPhaseSection, getAttackPathPhase, getPathMissions };
