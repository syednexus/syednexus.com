"use client";

import { motion } from "framer-motion";

import {
  ATTACK_PATH_PHASES,
  type AttackPathPhaseId
} from "@/lib/labConfig";

type AttackLabPipelineProps = {
  activePhase: AttackPathPhaseId | "ALL";
  onPhaseChange: (phase: AttackPathPhaseId | "ALL") => void;
};

export default function AttackLabPipeline({
  activePhase,
  onPhaseChange
}: AttackLabPipelineProps) {
  return (
    <section className="mt-10 rounded-xl border border-red-900/60 bg-red-950/10 p-6">
      <p className="text-xs uppercase tracking-widest text-red-400">Attack Path</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {ATTACK_PATH_PHASES.map((phase, index) => {
          const active = activePhase === phase.id;

          return (
            <div key={phase.id} className="flex flex-1 items-center gap-3">
              <motion.button
                type="button"
                onClick={() => onPhaseChange(active ? "ALL" : phase.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                  active
                    ? "border-red-500 bg-red-950/40 text-red-300"
                    : "border-red-900/70 text-gray-400 hover:border-red-700 hover:text-red-300"
                }`}
              >
                <p className="text-xs text-gray-500">Step {phase.step}</p>
                <p className="mt-1 text-lg font-bold">{phase.title}</p>
                <p className="mt-1 text-xs text-gray-600">{phase.subtitle}</p>
              </motion.button>

              {index < ATTACK_PATH_PHASES.length - 1 && (
                <span className="hidden text-red-700 lg:inline">→</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-600">
        Recon → Enumeration → Exploitation → Privilege → Report — select a phase to filter labs.
      </p>
    </section>
  );
}

export { matchesAttackPathPhase as matchesAttackPhase } from "@/lib/labConfig";
export type { AttackPathPhaseId as AttackLabPhaseId } from "@/lib/labConfig";
