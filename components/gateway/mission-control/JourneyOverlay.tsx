"use client";

import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import type { TimelineEvent } from "./types";

type Props = {
  events: TimelineEvent[];
  onClose: () => void;
};

export default function JourneyOverlay({ events, onClose }: Props) {
  const { playSound } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xl rounded-2xl border border-green-500/25 bg-slate-900/95 p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-green-400">Career Journey</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Professional Path</h2>
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

        <ol className="relative mt-8 space-y-0 border-l border-green-500/30 pl-6">
          {events.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative pb-6 last:pb-0"
            >
              <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border border-green-400 bg-green-400/30" />
              <p className="font-medium text-slate-100">{event.label}</p>
              {event.period && <p className="text-xs text-slate-500">{event.period}</p>}
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}
