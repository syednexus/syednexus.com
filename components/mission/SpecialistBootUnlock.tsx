"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Achievement } from "@/context/NexusContext";
import { bootLinesForAchievement } from "@/lib/achievementTier";

type Props = {
  achievement: Achievement;
  onComplete: () => void;
};

export default function SpecialistBootUnlock({
  achievement,
  onComplete
}: Props) {
  const lines = bootLinesForAchievement(achievement);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [achievement.id]);

  useEffect(() => {
    if (index < lines.length) {
      const timer = window.setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 550);
      return () => window.clearTimeout(timer);
    }

    const finish = window.setTimeout(onComplete, 650);
    return () => window.clearTimeout(finish);
  }, [index, lines.length, onComplete]);

  const progress = Math.round((index / lines.length) * 100);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/90
        p-6
        font-mono
      "
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{
          boxShadow: "0 0 48px rgba(34,197,94,0.15)",
          borderColor: "rgba(34,197,94,0.5)"
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="
          group/boot
          relative
          w-full
          max-w-2xl
          overflow-hidden
          border
          border-green-900/70
          bg-black
          p-8
          shadow-[0_0_40px_rgba(34,197,94,0.08)]
        "
      >
        <motion.div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-300
            group-hover/boot:opacity-100
            bg-[linear-gradient(120deg,transparent,rgba(34,197,94,0.06),transparent)]
          "
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
        />

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative text-xs tracking-[0.35em] text-green-700"
        >
          NEXUS OS // SPECIALIST BOOT
        </motion.p>

        <div className="relative mt-6 min-h-[180px] space-y-2">
          {lines.slice(0, index).map((line, lineIndex) => (
            <motion.p
              key={`${achievement.id}-${lineIndex}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4, color: "#86efac" }}
              transition={{ duration: 0.18 }}
              className="cursor-default text-sm text-green-400"
            >
              {line}
              {lineIndex === index - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="ml-1 text-green-600"
                >
                  _
                </motion.span>
              )}
            </motion.p>
          ))}
        </div>

        <div className="relative mt-8 h-1.5 overflow-hidden rounded bg-gray-900">
          <motion.div
            className="h-full rounded bg-green-600"
            animate={{
              width: `${progress}%`,
              boxShadow: [
                "0 0 0px rgba(34,197,94,0)",
                "0 0 12px rgba(34,197,94,0.6)",
                "0 0 0px rgba(34,197,94,0)"
              ]
            }}
            transition={{
              width: { duration: 0.3 },
              boxShadow: { duration: 1.2, repeat: Infinity }
            }}
          />
        </div>

        <motion.p
          key={progress}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-xs text-gray-600"
        >
          specialist module load {progress}%
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
