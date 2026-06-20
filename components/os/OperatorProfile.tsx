"use client";

import { useAnalyst } from "@/context/AnalystProvider";

export default function OperatorProfile() {
  const { rank, xp, completedMissions, totalMissions } = useAnalyst();

  return (
    <div className="grid gap-4 rounded-2xl border border-green-900/50 bg-black/40 p-5 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Analyst Rank</p>
        <p className="mt-2 text-xl font-semibold text-green-300">{rank.title}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">XP</p>
        <p className="mt-2 text-xl font-semibold text-green-300">{xp}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Completed Missions</p>
        <p className="mt-2 text-xl font-semibold text-green-300">{completedMissions}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Total Missions</p>
        <p className="mt-2 text-xl font-semibold text-green-300">{totalMissions}</p>
      </div>
    </div>
  );
}
