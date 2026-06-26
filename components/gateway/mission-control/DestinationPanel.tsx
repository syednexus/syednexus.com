"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useSound } from "@/context/SoundContext";
import type { GlobeHotspot } from "./types";

type Props = {
  hotspot: GlobeHotspot;
  onClose: () => void;
};

export default function DestinationPanel({ hotspot, onClose }: Props) {
  const { playSound } = useSound();
  const href = hotspot.action.type === "navigate" ? hotspot.action.href : "/";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-cyan-500/25 bg-slate-900/95 p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500">Destination</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{hotspot.label}</h2>
            <p className="mt-2 text-sm text-slate-400">{hotspot.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound("ui.panel.close");
              onClose();
            }}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:text-cyan-200"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-slate-300">
          Explore this module of the Syed Nexus ecosystem. The globe stays focused on this region
          until you choose Global View.
        </p>

        <Link
          href={href}
          onClick={() => {
            if (hotspot.action.type === "navigate" && hotspot.action.sound === "soc") {
              playSound("mission.start");
            } else {
              playSound("ui.click");
            }
          }}
          className="mt-6 inline-flex rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
        >
          Enter {hotspot.label} →
        </Link>
      </motion.div>
    </motion.div>
  );
}
