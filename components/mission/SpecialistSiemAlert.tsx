"use client";

import { motion } from "framer-motion";

import type { Achievement } from "@/context/NexusContext";

type Props = {
  achievement: Achievement;
  onDismiss: () => void;
};

export default function SpecialistSiemAlert({
  achievement,
  onDismiss
}: Props) {
  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="
        fixed
        inset-x-0
        top-20
        z-[120]
        px-4
      "
    >
      <motion.div
        whileHover={{
          y: -2,
          boxShadow: "0 12px 40px rgba(245,158,11,0.18)",
          borderColor: "rgba(245,158,11,0.6)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="
          group/alert
          relative
          mx-auto
          max-w-4xl
          overflow-hidden
          border
          border-amber-700/70
          bg-black/95
          p-5
          font-mono
          shadow-[0_0_40px_rgba(245,158,11,0.12)]
        "
      >
        <motion.div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(transparent_50%,rgba(245,158,11,0.03)_50%)]
            bg-[length:100%_4px]
          "
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 0.12, repeat: Infinity }}
        />

        <motion.div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-300
            group-hover/alert:opacity-100
            bg-[linear-gradient(120deg,transparent,rgba(245,158,11,0.1),transparent)]
          "
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs tracking-[0.35em] text-amber-500"
            >
              [!] SIEM ALERT // SPECIALIST CLEARANCE
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
              className="mt-3 text-xl text-amber-300"
            >
              <motion.span
                className="mr-2 inline-block"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {achievement.icon}
              </motion.span>
              {achievement.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.2 }}
              className="mt-2 text-sm text-gray-400 transition-colors group-hover/alert:text-gray-300"
            >
              {achievement.description}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.26, duration: 0.45 }}
              className="
                mt-4
                h-px
                origin-left
                bg-gradient-to-r
                from-amber-600
                via-amber-900
                to-transparent
              "
            />

            <p className="mt-3 text-xs text-amber-900 transition-colors group-hover/alert:text-amber-800">
              SEVERITY: HIGH | CLASS: SPECIALIST | STATUS: ACK REQUIRED
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onDismiss}
            aria-label="Acknowledge specialist alert"
            whileHover={{
              scale: 1.08,
              borderColor: "rgba(245,158,11,0.8)",
              color: "#fbbf24",
              boxShadow: "0 0 16px rgba(245,158,11,0.25)"
            }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="
              shrink-0
              border
              border-amber-900
              px-3
              py-1
              text-xs
              text-amber-700
            "
          >
            [ACK]
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
