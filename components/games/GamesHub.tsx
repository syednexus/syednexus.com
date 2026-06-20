"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useMissionsOptional } from "@/context/MissionsProvider";
import GameCategory from "@/components/games/GameCategory";
import { cyberGamesCategories } from "@/data/cyberGamesPack001";
import { useOperatorStats } from "@/hooks/useOperatorStats";

export default function GamesHub() {
  const { rank, xp } = useOperatorStats();
  const missionsContext = useMissionsOptional();

  const categories = useMemo(() => {
    if (!missionsContext) {
      return [];
    }

    return Object.values(cyberGamesCategories).map((category) => ({
      ...category,
      missions: category.slugs
        .map((slug) => missionsContext.getMissionBySlug(slug))
        .filter((mission): mission is NonNullable<typeof mission> => Boolean(mission)),
    }));
  }, [missionsContext]);

  if (!missionsContext) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-green-400 md:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-900/40 bg-black/40 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-300">Games Hub Offline</h1>
          <p className="mt-4 text-sm leading-7 text-gray-400">
            Mission providers are not mounted. Ensure you are on the Nexus OS feature
            branch, restart <code className="text-green-400">npm run dev</code>, then reload.
          </p>
          <Link
            href="/nexus"
            className="mt-6 inline-block rounded border border-green-800 px-4 py-2 text-sm text-green-300"
          >
            Back to Nexus OS
          </Link>
        </div>
      </div>
    );
  }

  const { isMissionCompleted } = missionsContext;

  const totalGames = categories.reduce((sum, category) => sum + category.missions.length, 0);
  const completedGames = categories.reduce(
    (sum, category) =>
      sum + category.missions.filter((mission) => isMissionCompleted(mission.slug)).length,
    0,
  );

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-green-400 md:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-10 border-b border-green-900/40 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/nexus"
                className="text-sm text-gray-500 transition hover:text-green-400"
              >
                ← Back to Nexus OS
              </Link>
              <p className="mt-4 text-xs uppercase tracking-[0.45em] text-gray-500">
                Interactive Learning Arcade
              </p>
              <h1 className="mt-3 text-5xl font-bold tracking-[0.15em] text-green-300 md:text-6xl">
                CYBER GAMES
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
                Train in the Linux Arena, Networking Arena, Packet Analysis labs, and Quiz Arcade.
                Every game routes through the shared mission engine and XP progression.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-green-900/50 bg-black/40 p-5 font-mono text-sm backdrop-blur-md sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Rank</p>
                <p className="mt-1 text-green-300">{rank.title}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">XP</p>
                <p className="mt-1 text-green-300">{xp}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Completed</p>
                <p className="mt-1 text-green-300">
                  {completedGames}/{totalGames}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Status</p>
                <p className="mt-1 text-green-400">ARCADE ONLINE</p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {categories.map((category) => (
            <GameCategory
              key={category.title}
              title={category.title}
              description={category.description}
              missions={category.missions}
              isMissionCompleted={isMissionCompleted}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
