"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";

export default function DailyChallenge() {
  const mounted = useMounted();
  const { daily, loading, error } = useDailyChallenge();
  const mission = daily.challenge?.mission;
  const streak = daily.streak;

  if (loading) {
    return (
      <section className="mt-10 rounded-xl border border-cyan-900 p-6">
        <p className="text-cyan-400">DAILY INCIDENT</p>
        <p className="mt-4 text-gray-500">Loading today&apos;s challenge...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-10 rounded-xl border border-red-900 p-6">
        <p className="text-red-400">DAILY INCIDENT — load failed</p>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
      </section>
    );
  }

  if (!mission) {
    return (
      <section className="mt-10 rounded-xl border border-cyan-900 p-6">
        <p className="text-cyan-400">DAILY INCIDENT</p>
        <p className="mt-4 text-gray-500">No active missions available for today&apos;s challenge.</p>
      </section>
    );
  }

  return (
    <motion.section
      initial={false}
      whileHover={{ boxShadow: "0 12px 40px rgba(34,211,238,0.08)" }}
      className="
        mt-10
        rounded-xl
        border
        border-cyan-800
        bg-gradient-to-br
        from-cyan-950/20
        to-black
        p-6
        sm:p-8
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">Daily Incident</p>
          <h2 className="mt-2 text-2xl font-bold text-green-300 sm:text-3xl">{mission.title}</h2>
        </div>

        <div className="rounded-lg border border-yellow-800 bg-yellow-950/20 px-4 py-3 text-center">
          <p className="text-xs text-yellow-600">CURRENT STREAK</p>
          <p className="text-3xl font-bold text-yellow-400">
            {formatDynamicStat(mounted, streak.currentStreak)}
          </p>
          {mounted && streak.longestStreak > 0 && (
            <p className="mt-1 text-xs text-gray-500">Best: {streak.longestStreak}</p>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 max-w-3xl text-sm text-gray-400">{mission.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <span className="rounded border border-green-900 px-3 py-1 text-green-400">
          [{mission.type}]
        </span>
        <span className="text-yellow-400">{mission.difficulty}</span>
        <span className="text-green-400">{mission.xp} XP</span>
        {streak.dailyCompleted && (
          <span className="rounded border border-green-600 bg-green-950/40 px-3 py-1 text-green-400">
            COMPLETED TODAY
          </span>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {streak.dailyCompleted ? (
          <span className="border border-green-700 px-6 py-3 text-green-500">MISSION CLOSED</span>
        ) : (
          <Link
            href={`/mission/${mission.slug}`}
            className="
              border
              border-cyan-500
              px-6
              py-3
              text-cyan-300
              transition
              hover:bg-cyan-950/40
              hover:text-cyan-200
            "
          >
            START DAILY MISSION
          </Link>
        )}
      </div>
    </motion.section>
  );
}
