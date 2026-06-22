"use client";

import { motion } from "framer-motion";

import { useAnalyst } from "@/hooks/useAnalyst";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";
import { useMissions } from "@/hooks/useMissions";
import type { PublicMission } from "@/types/PublicMission";

const cardMotion = {
  initial: false as const,
  whileHover: { y: -6, scale: 1.02, boxShadow: "0 8px 24px rgba(34,197,94,0.12)" },
  transition: { type: "spring" as const, stiffness: 380, damping: 24 }
};

type StatCardProps = {
  label: string;
  value: string | number;
  borderClass: string;
  mounted: boolean;
};

function StatCard({ label, value, borderClass, mounted }: StatCardProps) {
  const display = formatDynamicStat(mounted, value);

  return (
    <motion.div
      {...cardMotion}
      className={`rounded-xl border p-5 transition-colors hover:border-green-600 ${borderClass}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      {mounted ? (
        <motion.h2
          initial={false}
          animate={{ scale: 1, color: "#ffffff" }}
          className="mt-3 break-words text-3xl font-bold sm:text-4xl"
        >
          {display}
        </motion.h2>
      ) : (
        <p
          className="mt-3 h-9 w-24 animate-pulse rounded bg-green-950/40 text-3xl font-bold text-gray-600 sm:h-10 sm:text-4xl"
          aria-hidden
        >
          --
        </p>
      )}
    </motion.div>
  );
}

type CyberStatsProps = {
  missions?: PublicMission[];
};

export default function CyberStats({ missions: scopedMissions }: CyberStatsProps) {
  const mounted = useMounted();
  const allMissions = useMissions();
  const analyst = useAnalyst();
  const missions = scopedMissions ?? allMissions;

  const completedInScope = scopedMissions
    ? scopedMissions.filter(m => analyst.completedMissionIds.includes(m.id)).length
    : analyst.completed;

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="TOTAL MISSIONS"
        value={missions.length}
        borderClass="border-green-800"
        mounted={mounted}
      />
      <StatCard
        label="COMPLETED MISSIONS"
        value={completedInScope}
        borderClass="border-blue-800"
        mounted={mounted}
      />
      <StatCard
        label="TOTAL XP"
        value={analyst.xp.toLocaleString()}
        borderClass="border-purple-800"
        mounted={mounted}
      />
      <StatCard
        label="CURRENT RANK"
        value={analyst.rank}
        borderClass="border-yellow-800"
        mounted={mounted}
      />
    </div>
  );
}
