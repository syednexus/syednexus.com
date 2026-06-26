"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { FeedItem } from "./types";

const SEVERITY_COLOR: Record<FeedItem["severity"], string> = {
  info: "text-cyan-300",
  success: "text-green-400",
  warning: "text-amber-400",
  critical: "text-red-400"
};

function formatFeedTimestamp(timestamp: string): string {
  if (!timestamp) return "";
  const match = timestamp.match(/T(\d{2}:\d{2}:\d{2})/);
  return match ? `${match[1]} UTC` : "";
}

export default function MissionControlFeed({ items }: { items: FeedItem[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const current = items[index];

  return (
    <div className="pointer-events-none absolute bottom-16 right-4 z-20 w-72 max-w-[calc(100vw-2rem)] sm:bottom-20 sm:right-6">
      <div className="rounded-xl border border-cyan-500/20 bg-slate-950/90 p-3 backdrop-blur-md">
        <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-500/70">System Feed</p>
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="mt-2"
            >
              <p className={`text-xs leading-relaxed ${SEVERITY_COLOR[current.severity]}`}>
                {current.message}
              </p>
              {mounted && current.timestamp ? (
                <p className="mt-1 font-mono text-[9px] text-slate-600">
                  {formatFeedTimestamp(current.timestamp)}
                </p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
