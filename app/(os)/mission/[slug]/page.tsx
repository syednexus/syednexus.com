"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useMissions } from "@/context/MissionsProvider";
import { useNexus } from "@/context/NexusContext";
import { getRankFromXp } from "@/lib/rank";
import { MISSION_TYPE_LABELS } from "@/types/mission";

export default function MissionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { xp } = useNexus();
  const {
    getMissionBySlug,
    setActiveMission,
    isMissionCompleted,
    completeMission,
  } = useMissions();

  const mission = getMissionBySlug(slug);
  const completed = isMissionCompleted(slug);
  const rank = getRankFromXp(xp);

  useEffect(() => {
    if (!mission) {
      setActiveMission(null);
      return;
    }

    setActiveMission(mission);

    return () => {
      setActiveMission(null);
    };
  }, [mission, setActiveMission]);

  if (!mission) {
    return (
      <main className="min-h-screen bg-black px-8 py-12 text-green-400">
        <section className="mx-auto max-w-3xl rounded-2xl border border-red-900/40 bg-black/40 p-10">
          <h1 className="text-3xl font-bold text-red-300">Mission Not Found</h1>
          <p className="mt-4 text-gray-400">
            The requested mission does not exist in the Nexus catalog.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded border border-green-800 px-4 py-2 text-sm text-green-300 transition hover:bg-green-950/30"
          >
            Return to Nexus OS
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-8 py-12 text-green-400">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-green-400"
        >
          ← Back to Nexus OS
        </Link>

        <div className="mt-6 rounded-2xl border border-green-900/40 bg-black/40 p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
            <span>{MISSION_TYPE_LABELS[mission.type]}</span>
            <span>•</span>
            <span>{mission.difficulty}</span>
            <span>•</span>
            <span>{mission.duration}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-wide text-green-300">
            {mission.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-400">{mission.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {mission.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-green-900/50 px-3 py-1 text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-green-900/30 pt-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Reward</p>
              <p className="mt-2 text-lg text-green-300">+{mission.xpReward} XP</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Rank</p>
              <p className="mt-2 text-lg text-green-300">{rank.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Status</p>
              <p className="mt-2 text-lg text-green-300">
                {completed ? "Completed" : "Available"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-green-900/30 bg-green-950/10 p-5 text-sm leading-7 text-gray-400">
            Mission engine routing is active for this challenge type. Complete the
            scenario workflow to register progress and earn XP toward your Nexus rank.
          </div>

          <button
            type="button"
            disabled={completed}
            onClick={() => completeMission(mission.slug)}
            className="mt-8 rounded border border-green-700 px-5 py-3 text-sm font-medium text-green-300 transition hover:bg-green-950/40 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600"
          >
            {completed ? "Mission Completed" : "Complete Mission"}
          </button>
        </div>
      </section>
    </main>
  );
}
