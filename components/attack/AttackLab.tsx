"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import { AttackPathPhaseSection } from "@/components/attack/AttackPathPhase";
import AttackPathPipeline from "@/components/attack/AttackPathPipeline";
import { useAnalyst } from "@/hooks/useAnalyst";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";
import { useMissions, useMissionsStatus } from "@/hooks/useMissions";
import { ATTACK_PATH_PHASES, getPathMissions } from "@/lib/labConfig";
import { getAttackLabXp, isAttackLabMission } from "@/lib/attackLabPhases";

export default function AttackLab() {
  const mounted = useMounted();
  const allMissions = useMissions();
  const analyst = useAnalyst();
  const { loading, error } = useMissionsStatus();

  const attackMissions = useMemo(
    () => allMissions.filter(isAttackLabMission),
    [allMissions]
  );

  const completedIds = useMemo(
    () => new Set(analyst.completedMissionIds),
    [analyst.completedMissionIds]
  );

  const completedAttacks = useMemo(
    () => attackMissions.filter(mission => completedIds.has(mission.id)).length,
    [attackMissions, completedIds]
  );

  const exploitationXp = useMemo(
    () => getAttackLabXp(attackMissions, completedIds),
    [attackMissions, completedIds]
  );

  return (
    <main className="min-h-screen bg-black p-5 font-mono text-green-400 sm:p-8 lg:p-10">
      <p className="text-gray-500">root@nexus:/attack#</p>

      <header className="mt-5">
        <p className="text-xs uppercase tracking-widest text-red-500">Junior Penetration Tester</p>
        <h1 className="mt-2 text-3xl font-bold text-red-300 sm:text-4xl lg:text-5xl">
          ATTACK LAB CONSOLE
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-gray-400 sm:text-base">
          Hands-on simulated labs — recon terminals, vulnerable web apps, password cracking, and
          Metasploit-style exploitation. No real targets. Shared XP and rank via Mission Engine.
        </p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ConsoleStat
          label="Completed Labs"
          value={completedAttacks}
          borderClass="border-red-800"
          mounted={mounted}
        />
        <ConsoleStat
          label="Exploitation XP"
          value={exploitationXp.toLocaleString()}
          borderClass="border-green-800"
          mounted={mounted}
        />
        <ConsoleStat
          label="Current Rank"
          value={analyst.rank}
          borderClass="border-yellow-800"
          mounted={mounted}
        />
      </section>

      <AttackPathPipeline />

      {loading && <p className="mt-10 text-gray-500">Loading attack labs...</p>}
      {error && <p className="mt-10 text-red-400">Failed to load missions: {error}</p>}

      {mounted && !loading && !error && attackMissions.length > 0 && (
        <div className="mt-10 space-y-8">
          {ATTACK_PATH_PHASES.map(phase => (
            <AttackPathPhaseSection
              key={phase.id}
              phaseId={phase.id}
              missions={getPathMissions(phase.id, attackMissions)}
              completedIds={completedIds}
            />
          ))}
        </div>
      )}

      {mounted && !loading && !error && attackMissions.length === 0 && (
        <div className="mt-10 rounded-xl border border-red-900 p-10 text-center">
          <p className="text-xl text-gray-500">No attack labs found</p>
          <p className="mt-3 text-sm text-gray-600">
            Run: <span className="text-green-600">ALLOW_DB_SEED=true npm run seed:attack</span>
          </p>
        </div>
      )}
    </main>
  );
}

function ConsoleStat({
  label,
  value,
  borderClass,
  mounted
}: {
  label: string;
  value: string | number;
  borderClass: string;
  mounted: boolean;
}) {
  const display = formatDynamicStat(mounted, value);

  return (
    <motion.div
      initial={false}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(239,68,68,0.1)" }}
      className={`rounded-xl border ${borderClass} bg-black/50 p-5`}
    >
      <p className="text-xs uppercase text-gray-500">{label}</p>
      {mounted ? (
        <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">{display}</p>
      ) : (
        <p
          className="mt-3 h-8 w-20 animate-pulse rounded bg-red-950/30 text-2xl font-bold text-gray-600 sm:h-9 sm:text-3xl"
          aria-hidden
        >
          --
        </p>
      )}
    </motion.div>
  );
}
