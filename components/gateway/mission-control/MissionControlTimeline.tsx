"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { TimelineEvent } from "./types";

export default function MissionControlTimeline({ events }: { events: TimelineEvent[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const lineScale = useTransform(scrollXProgress, [0, 1], [0.15, 1]);

  if (events.length === 0) return null;

  return (
    <section className="border-t border-cyan-500/10 bg-slate-950/60 px-4 py-3">
      <p className="mb-2 text-[9px] uppercase tracking-[0.35em] text-cyan-500/70">Career Timeline</p>
      <div ref={ref} className="overflow-x-auto pb-2">
        <div className="relative flex min-w-max items-start gap-0 px-2">
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute left-4 right-4 top-4 h-px origin-left bg-gradient-to-r from-cyan-500/50 via-cyan-400/30 to-transparent"
          />
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: index * 0.06 }}
              className="relative flex w-36 shrink-0 flex-col items-center px-2"
            >
              <span className="relative z-10 h-2 w-2 rounded-full border border-cyan-400 bg-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              <p className="mt-3 text-center text-[10px] font-medium leading-snug text-slate-200">
                {event.label}
              </p>
              {event.period && (
                <p className="mt-1 text-center text-[9px] text-slate-500">{event.period}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
