"use client";

import { motion } from "framer-motion";

import type { MissionControlStats } from "./types";

type Props = {
  stats: MissionControlStats;
};

const METRICS: Array<{
  key: keyof MissionControlStats;
  label: string;
  format?: (v: number | boolean | null) => string;
}> = [
  { key: "missions", label: "Missions" },
  { key: "projects", label: "Projects" },
  { key: "blogs", label: "Blogs" },
  { key: "certifications", label: "Certs" },
  { key: "skills", label: "Skills" },
  { key: "completedMissions", label: "Completed" },
  { key: "xp", label: "XP" },
  {
    key: "databaseHealthy",
    label: "Database",
    format: v => (v === true ? "OK" : v === false ? "DEG" : "—")
  }
];

export default function MissionControlAnalytics({ stats }: Props) {
  return (
    <div className="border-t border-cyan-500/10 bg-slate-950/90 px-3 py-2 backdrop-blur-md">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {METRICS.map((metric, index) => {
          const raw = stats[metric.key];
          const display =
            metric.format && (typeof raw === "boolean" || raw === null)
              ? metric.format(raw)
              : String(raw ?? "—");

          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="min-w-[88px] shrink-0 rounded-lg border border-cyan-500/15 bg-cyan-950/20 px-3 py-2"
            >
              <p className="text-[9px] uppercase tracking-widest text-cyan-500/70">{metric.label}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-cyan-100">{display}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
