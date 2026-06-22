"use client";

import { motion } from "framer-motion";

import { ATTACK_PATH_PHASES } from "@/lib/labConfig";

type AttackPathPipelineProps = {
  activePhase?: string;
};

export default function AttackPathPipeline({ activePhase }: AttackPathPipelineProps) {
  return (
    <section className="mt-10 rounded-xl border border-red-900/70 bg-red-950/10 p-6">
      <p className="text-xs uppercase tracking-widest text-red-500">Attack Path</p>
      <p className="mt-2 text-sm text-gray-500">
        TryHackMe-style progression — each lab opens an interactive simulated environment.
      </p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
        {ATTACK_PATH_PHASES.map((phase, index) => {
          const active = activePhase === phase.id;

          return (
            <div key={phase.id} className="flex flex-1 items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`w-full rounded-lg border px-4 py-4 ${
                  active
                    ? "border-red-500 bg-red-950/40"
                    : "border-red-900/60 bg-black/40"
                }`}
              >
                <p className="text-xs text-gray-500">Step {phase.step}</p>
                <p className="mt-1 text-lg font-bold text-red-300">{phase.title}</p>
                <p className="mt-2 text-xs text-gray-500">{phase.subtitle}</p>
              </motion.div>

              {index < ATTACK_PATH_PHASES.length - 1 && (
                <span className="hidden text-red-700 lg:inline">→</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
