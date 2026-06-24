"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import MissionCard from "@/components/cyber/MissionCard";
import CyberStats from "@/components/cyber/CyberStats";
import { useAnalyst } from "@/hooks/useAnalyst";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";
import { useMissions, useMissionsStatus } from "@/hooks/useMissions";
import { filterModuleMissions } from "@/lib/moduleMissionFilters";
import {
  PRACTICAL_PATHS,
  type PracticalModule
} from "@/lib/practicalConfig";

type PracticalModuleHubProps = {
  module: PracticalModule;
  title: string;
  description: string;
  allowedTypes: string[];
  modulePath: string;
  accentClass?: string;
};

export default function PracticalModuleHub({
  module,
  title,
  description,
  allowedTypes,
  modulePath,
  accentClass = "text-green-400"
}: PracticalModuleHubProps) {
  const mounted = useMounted();
  const allMissions = useMissions();
  const analyst = useAnalyst();
  const { loading, error } = useMissionsStatus();

  const missions = filterModuleMissions(allMissions, allowedTypes);
  const completedIds = new Set(analyst.completedMissionIds);

  const path = PRACTICAL_PATHS[module];

  return (
    <main className="min-h-screen bg-black p-5 font-mono text-green-400 sm:p-8 lg:p-10">
      <p className="text-gray-500">root@nexus:/{modulePath}#</p>

      <header className="mt-5">
        <h1 className={`text-3xl font-bold sm:text-4xl lg:text-5xl ${accentClass}`}>{title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-gray-400 sm:text-base">{description}</p>
      </header>

      <CyberStats missions={missions} />

      <section className="mt-10 rounded-xl border border-green-900/70 bg-green-950/10 p-6">
        <p className="text-xs uppercase tracking-widest text-gray-500">Learning Path</p>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {path.map(phase => (
            <motion.div
              key={phase.step}
              initial={false}
              whileHover={{ y: -4 }}
              className="rounded-lg border border-green-900/60 bg-black/40 p-4"
            >
              <p className="text-xs text-gray-500">Step {phase.step}</p>
              <p className="mt-1 text-lg font-bold text-green-300">{phase.title}</p>
              <p className="mt-2 text-xs text-gray-500">{phase.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {loading && <p className="mt-10 text-gray-500">Loading labs...</p>}
      {error && <p className="mt-10 text-red-400">Failed to load missions: {error}</p>}

      {mounted && !loading && !error && missions.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-green-300">Available Labs</h2>
            <p className="text-sm text-gray-500">
              {formatDynamicStat(
                mounted,
                `${missions.filter(m => completedIds.has(m.id)).length}/${missions.length} complete`
              )}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {missions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed={completedIds.has(mission.id)}
              />
            ))}
          </div>
        </section>
      )}

      {mounted && !loading && !error && missions.length === 0 && (
        <div className="mt-10 rounded-xl border border-green-900 p-10 text-center">
          <p className="text-xl text-gray-500">No labs found for this module</p>
          <p className="mt-3 text-sm text-gray-600">
            Run: <span className="text-green-600">ALLOW_DB_SEED=true npm run seed:practical</span>
          </p>
          <Link href="/nexus" className="mt-6 inline-block text-green-400 hover:underline">
            ← Back to Nexus OS
          </Link>
        </div>
      )}
    </main>
  );
}
