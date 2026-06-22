"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Mission } from "@/types/mission";

type MissionCardProps = {
  mission: Mission;
  completed?: boolean;
};

function difficultyColor(difficulty: string) {
  const normalized = difficulty.toLowerCase();

  if (normalized.includes("beginner") || normalized.includes("easy")) {
    return "text-green-400";
  }

  if (normalized.includes("intermediate") || normalized.includes("medium")) {
    return "text-yellow-400";
  }

  if (normalized.includes("advanced") || normalized.includes("hard")) {
    return "text-red-400";
  }

  return "text-gray-400";
}

export default function MissionCard({ mission, completed = false }: MissionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 12px 32px rgba(34,197,94,0.14)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <Link
        href={`/mission/${mission.slug}`}
        className="
          group
          block
          h-full
          rounded-xl
          border
          border-green-900
          p-5
          transition-colors
          duration-300
          hover:border-green-600
          hover:bg-green-950/25
          sm:p-6
        "
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-red-400">[{mission.type}]</p>
          <span
            className={`
              rounded
              border
              px-2
              py-0.5
              text-xs
              ${completed
                ? "border-green-600 bg-green-950/50 text-green-400"
                : "border-gray-700 text-gray-500"}
            `}
          >
            {completed ? "COMPLETED" : "OPEN"}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-green-300 transition group-hover:text-green-200 sm:text-xl">
          {mission.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm text-gray-400">{mission.description}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-green-900/60 pt-4 text-sm">
          <span className={difficultyColor(mission.difficulty)}>{mission.difficulty}</span>
          <span className="text-green-400">{mission.xp} XP</span>
        </div>

        <p className="mt-2 text-xs text-gray-600">{mission.category}</p>
      </Link>
    </motion.div>
  );
}
