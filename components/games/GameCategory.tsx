"use client";

import { Mission } from "@/types/mission";
import GameCard from "@/components/games/GameCard";

type GameCategoryProps = {
  title: string;
  description: string;
  missions: Mission[];
  isMissionCompleted: (slug: string) => boolean;
};

export default function GameCategory({
  title,
  description,
  missions,
  isMissionCompleted,
}: GameCategoryProps) {
  return (
    <section className="rounded-2xl border border-green-900/40 bg-black/30 p-6 backdrop-blur-md">
      <div className="mb-6 border-b border-green-900/30 pb-5">
        <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Arena</p>
        <h2 className="mt-2 text-2xl font-bold tracking-wide text-green-300">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">{description}</p>
        <p className="mt-3 text-xs uppercase tracking-widest text-gray-600">
          {missions.length} games loaded
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((mission) => (
          <GameCard
            key={mission.id}
            mission={mission}
            completed={isMissionCompleted(mission.slug)}
          />
        ))}
      </div>
    </section>
  );
}
