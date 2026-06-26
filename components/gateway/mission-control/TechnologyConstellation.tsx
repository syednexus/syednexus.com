"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import type { NexusProfile } from "@/lib/nexusData";

type Props = {
  profile: NexusProfile;
  onClose: () => void;
};

export default function TechnologyConstellation({ profile, onClose }: Props) {
  const { playSound } = useSound();

  const clusters = useMemo(() => {
    const skills = profile.skills || {};
    return Object.entries(skills)
      .filter(([, items]) => Array.isArray(items) && items.length > 0)
      .map(([category, items]) => ({
        category: category.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
        items: items as string[]
      }));
  }, [profile.skills]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-500/25 bg-slate-900/95 p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400">Capability Map</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Technology Constellation</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound("ui.panel.close");
              onClose();
            }}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400"
          >
            ← Back
          </button>
        </div>

        <div className="relative mt-8 flex min-h-[280px] items-center justify-center">
          <div className="absolute h-48 w-48 rounded-full border border-amber-500/20 bg-amber-500/5" />
          <div className="absolute h-72 w-72 rounded-full border border-amber-500/10" />
          <span className="relative z-10 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs text-amber-200">
            Skills Core
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {clusters.map((cluster, clusterIndex) => (
            <motion.div
              key={cluster.category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: clusterIndex * 0.05 }}
              className="rounded-xl border border-amber-500/15 bg-black/30 p-4"
            >
              <p className="text-xs uppercase tracking-widest text-amber-500/80">{cluster.category}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cluster.items.map(item => (
                  <span
                    key={item}
                    className="rounded border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
