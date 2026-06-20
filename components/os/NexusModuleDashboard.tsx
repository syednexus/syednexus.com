"use client";

import Link from "next/link";

import { useMissions } from "@/context/MissionsProvider";
import { useNexus } from "@/context/NexusContext";
import { getRankFromXp } from "@/lib/rank";
import { MISSION_TYPE_LABELS, Mission, MissionType } from "@/types/mission";

type NexusModuleDashboardProps = {
  title: string;
  description: string;
  allowedTypes: MissionType[];
};

function difficultyColor(difficulty: Mission["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "text-green-400 border-green-800/60";
    case "intermediate":
      return "text-yellow-400 border-yellow-800/60";
    case "advanced":
      return "text-red-400 border-red-800/60";
    default:
      return "text-gray-400 border-gray-800/60";
  }
}

function MissionCard({
  mission,
  completed,
}: {
  mission: Mission;
  completed: boolean;
}) {
  return (
    <Link
      href={`/mission/${mission.slug}`}
      className="group rounded-2xl border border-green-900/40 bg-black/40 p-6 transition hover:border-green-700/60 hover:bg-green-950/20"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          {MISSION_TYPE_LABELS[mission.type]}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide ${difficultyColor(mission.difficulty)}`}
        >
          {mission.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-green-300 transition group-hover:text-white">
        {mission.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-400">{mission.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>{mission.duration}</span>
        <span>•</span>
        <span>+{mission.xpReward} XP</span>
        {completed && (
          <>
            <span>•</span>
            <span className="text-green-400">Completed</span>
          </>
        )}
      </div>
    </Link>
  );
}

export default function NexusModuleDashboard({
  title,
  description,
  allowedTypes,
}: NexusModuleDashboardProps) {
  const { xp } = useNexus();
  const { getMissionsByTypes, isMissionCompleted } = useMissions();
  const rank = getRankFromXp(xp);
  const moduleMissions = getMissionsByTypes(allowedTypes);

  return (
    <main className="min-h-screen bg-black px-8 py-12 text-green-400">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 border-b border-green-900/40 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-gray-500">
              Nexus OS Module
            </p>
            <h1 className="text-4xl font-bold tracking-widest text-green-300 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-green-900/40 bg-black/40 px-5 py-4 text-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500">Operator Status</p>
            <p className="mt-2 text-lg text-green-300">{rank.title}</p>
            <p className="mt-1 text-gray-400">{xp} XP</p>
          </div>
        </div>

        {moduleMissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-900/40 p-10 text-center text-gray-500">
            No missions are available for this module yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {moduleMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed={isMissionCompleted(mission.slug)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
