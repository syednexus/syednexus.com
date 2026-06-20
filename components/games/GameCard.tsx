"use client";

import Link from "next/link";

import { Mission } from "@/types/mission";

type GameCardProps = {
  mission: Mission;
  completed: boolean;
};

function difficultyStyles(difficulty: Mission["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "border-green-800/60 text-green-400";
    case "intermediate":
      return "border-yellow-800/60 text-yellow-400";
    case "advanced":
      return "border-red-800/60 text-red-400";
    default:
      return "border-gray-800/60 text-gray-400";
  }
}

export default function GameCard({ mission, completed }: GameCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-green-900/50 bg-black/40 p-5 backdrop-blur-md transition hover:border-green-600/60 hover:bg-green-950/20">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-green-300 transition group-hover:text-white">
          {mission.title}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${difficultyStyles(mission.difficulty)}`}
        >
          {mission.difficulty}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-gray-400">{mission.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>+{mission.xpReward} XP</span>
        <span>•</span>
        <span>{mission.duration}</span>
        <span>•</span>
        <span className={completed ? "text-green-400" : "text-gray-500"}>
          {completed ? "Completed" : "Not completed"}
        </span>
      </div>

      <Link
        href={`/mission/${mission.slug}`}
        className="mt-5 inline-flex items-center justify-center rounded border border-green-700 bg-green-950/30 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300 transition hover:bg-green-900/40"
      >
        Play
      </Link>
    </article>
  );
}
