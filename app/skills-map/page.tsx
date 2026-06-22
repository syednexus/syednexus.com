"use client";

import Link from "next/link";

import { useAnalyst, useAnalystStatus } from "@/context/AnalystContext";
import { isNodeUnlocked, SKILL_TREE } from "@/lib/skillTree";
import CertificationTracksPanel from "@/components/world/CertificationTracksPanel";

import { formatDynamicStat, useMounted } from "@/hooks/useMounted";

export default function SkillsMapPage() {
  const mounted = useMounted();
  const analyst = useAnalyst();
  const { loading } = useAnalystStatus();
  const xp = analyst?.xp ?? 0;
  const completed = analyst?.completed ?? 0;
  const xpDisplay = formatDynamicStat(mounted, xp, "—");
  const completedDisplay = formatDynamicStat(mounted, completed, "—");

  return (
    <main className="min-h-screen bg-black px-5 py-16 font-mono text-green-400 sm:px-8">
      <section className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-gray-600">Nexus OS // Career path</p>
        <h1 className="mt-4 text-4xl font-bold text-green-300">Skill Tree</h1>
        <p className="mt-4 text-gray-500">
          Unlock nodes by completing missions and earning XP. Your progress: {xpDisplay} XP · {completedDisplay} missions
        </p>

        {loading && <p className="mt-8 text-gray-600">Loading analyst profile...</p>}

        <div className="mt-12 space-y-6">
          {SKILL_TREE.map((node, index) => {
            const unlocked = isNodeUnlocked(node, xp, completed);
            return (
              <div key={node.id} className="flex flex-col items-center">
                <div
                  className={`w-full max-w-md rounded-xl border p-6 ${
                    unlocked
                      ? "border-green-600 bg-green-950/30"
                      : "border-gray-800 bg-gray-950/20 opacity-60"
                  }`}
                >
                  <p className="text-xs text-gray-600">
                    {unlocked ? "UNLOCKED" : "LOCKED"} · {node.xpRequired} XP · {node.missionsRequired} missions
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">{node.title}</h2>
                  <p className="mt-2 text-sm text-gray-500">{node.description}</p>
                </div>
                {index < SKILL_TREE.length - 1 && <p className="my-2 text-gray-700">↓</p>}
              </div>
            );
          })}
        </div>

        <CertificationTracksPanel />

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/nexus" className="border border-green-700 px-4 py-2 text-gray-400 hover:text-green-400">
            ← Nexus OS
          </Link>
          <Link href="/career" className="border border-green-700 px-4 py-2 text-gray-400 hover:text-green-400">
            Career Simulator
          </Link>
        </div>
      </section>
    </main>
  );
}
