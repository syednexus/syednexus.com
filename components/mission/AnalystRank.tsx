"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

import { useAnalyst } from "@/hooks/useAnalyst";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";

export default function AnalystRank() {
  const mounted = useMounted();
  const analyst = useAnalyst();
  const previousXp = useRef(analyst.xp);
  const [xpFlash, setXpFlash] = useState(false);

  const springXp = useSpring(mounted ? analyst.xp : 0, {
    stiffness: 90,
    damping: 18
  });

  const width = useTransform(springXp, value => {
    const percent = Math.min((value / analyst.next) * 100, 100);
    return `${percent}%`;
  });

  useEffect(() => {
    if (!mounted) return;

    if (analyst.xp > previousXp.current) {
      setXpFlash(true);
      const timer = window.setTimeout(() => setXpFlash(false), 700);
      previousXp.current = analyst.xp;
      springXp.set(analyst.xp);
      return () => window.clearTimeout(timer);
    }

    previousXp.current = analyst.xp;
    springXp.set(analyst.xp);
  }, [analyst.xp, springXp, mounted]);

  const rankDisplay = formatDynamicStat(mounted, analyst.rank);
  const xpDisplay = formatDynamicStat(mounted, analyst.xp);
  const completedDisplay = formatDynamicStat(mounted, analyst.completed);

  return (
    <motion.div
      initial={false}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 32px rgba(34,197,94,0.12)",
        borderColor: "rgba(34,197,94,0.45)"
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="
        group/rank
        rounded-xl
        border
        border-green-900/70
        bg-black/50
        p-6
        font-mono
        transition-colors
        duration-300
      "
    >
      <motion.p
        initial={false}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-xs tracking-[0.25em] text-green-800"
      >
        ANALYST PROFILE
      </motion.p>

      <motion.h2
        initial={false}
        whileHover={{ scale: 1.04, color: "#86efac" }}
        transition={{ type: "spring", stiffness: 280 }}
        className="mt-3 text-3xl text-green-400"
      >
        {rankDisplay}
      </motion.h2>

      <motion.p
        initial={false}
        animate={
          xpFlash
            ? { scale: [1, 1.12, 1], color: ["#9ca3af", "#fde047", "#9ca3af"] }
            : { scale: 1, color: "#9ca3af" }
        }
        transition={{ duration: 0.55 }}
        className="mt-3"
      >
        XP: {xpDisplay}
      </motion.p>

      <p className="text-gray-500 transition-colors group-hover/rank:text-gray-400">
        Completed Missions: {completedDisplay}
      </p>

      <div className="relative mt-5 h-2.5 overflow-hidden rounded bg-gray-900">
        {mounted ? (
          <motion.div
            initial={false}
            style={{ width }}
            whileHover={{ boxShadow: "0 0 14px rgba(34,197,94,0.7)" }}
            className="
              h-full
              rounded
              bg-linear-to-r
              from-green-700
              to-green-500
              transition-shadow
              duration-300
            "
          />
        ) : (
          <div className="h-full w-0 rounded bg-green-900/40" aria-hidden />
        )}
        <motion.div
          aria-hidden
          initial={false}
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            group-hover/rank:opacity-100
            bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)]
          "
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
      </div>
    </motion.div>
  );
}
