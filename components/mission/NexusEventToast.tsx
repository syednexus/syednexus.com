"use client";

import { motion } from "framer-motion";

export type NexusEventData = {
  title: string;
  description: string;
  icon: string;
};

type Props = {
  event: NexusEventData;
  onDismiss: () => void;
};

export default function NexusEventToast({ event, onDismiss }: Props) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 20, x: -12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 10, x: -8 }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 28px rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,0.5)"
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="
        group/toast
        fixed
        bottom-24
        left-6
        z-[100]
        max-w-sm
        border
        border-green-900/80
        bg-black/95
        p-4
        font-mono
        text-sm
        shadow-lg
        shadow-green-950/40
      "
    >
      <motion.div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(transparent_50%,rgba(34,197,94,0.03)_50%)]
          bg-[length:100%_3px]
          opacity-0
          transition-opacity
          duration-300
          group-hover/toast:opacity-100
        "
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.12, repeat: Infinity }}
      />

      <motion.p
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
        className="text-xs tracking-widest text-green-700"
      >
        [SYS] BADGE REGISTERED
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-2 text-green-400"
      >
        <span className="text-gray-500">root@nexus:~#</span> append &quot;{event.title}&quot;{" "}
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          [OK]
        </motion.span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        whileHover={{ x: 4 }}
        className="mt-2 text-gray-500"
      >
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.3, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {event.icon}
        </motion.span>{" "}
        {event.description}
      </motion.p>

      <motion.button
        type="button"
        onClick={onDismiss}
        whileHover={{ scale: 1.05, color: "#22c55e" }}
        whileTap={{ scale: 0.95 }}
        className="mt-3 text-xs text-gray-600"
      >
        dismiss_
      </motion.button>
    </motion.div>
  );
}
