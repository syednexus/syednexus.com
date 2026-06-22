"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Mission } from "@/types/mission";

type AttackMissionCardProps = {
  mission: Mission;
  completed?: boolean;
};

function difficultyClass(difficulty: string) {
  const value = difficulty.toLowerCase();

  if (value.includes("beginner") || value === "easy") return "text-green-400";
  if (value.includes("intermediate") || value === "medium") return "text-yellow-400";
  if (value.includes("advanced") || value === "hard") return "text-red-400";
  return "text-gray-400";
}

export default function AttackMissionCard({ mission, completed = false }: AttackMissionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, boxShadow: "0 12px 32px rgba(239,68,68,0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <Link
        href={`/mission/${mission.slug}`}
        className="group block h-full rounded-xl border border-red-900/80 bg-black/40 p-5 transition-colors hover:border-red-600 hover:bg-red-950/20"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-red-400">[{mission.type}]</p>
          <span
            className={`rounded border px-2 py-0.5 text-xs ${
              completed
                ? "border-green-600 bg-green-950/40 text-green-400"
                : "border-red-800 text-red-400"
            }`}
          >
            {completed ? "PWNED" : "OPEN"}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-red-200 group-hover:text-red-100">{mission.title}</h3>
        <p className="mt-1 text-xs text-red-500/80">{mission.category}</p>
        <p className="mt-3 line-clamp-2 text-sm text-gray-400">{mission.description}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-red-900/50 pt-4 text-sm">
          <span className={difficultyClass(mission.difficulty)}>{mission.difficulty}</span>
          <span className="text-green-400">{mission.xp} XP</span>
        </div>

        <p className="mt-4 text-sm text-red-400 group-hover:text-red-300">▶ START LAB</p>
      </Link>
    </motion.div>
  );
}
