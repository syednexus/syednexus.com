"use client";

import { motion } from "framer-motion";

import { useNexusDataStatus } from "@/hooks/useNexusData";

export default function NexusDataStatusBar() {
  const { loading } = useNexusDataStatus();

  if (!loading) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      className="
        fixed
        left-0
        right-0
        top-20
        z-[90]
        h-0.5
        origin-left
        bg-gradient-to-r
        from-green-600
        via-green-400
        to-transparent
      "
    />
  );
}
