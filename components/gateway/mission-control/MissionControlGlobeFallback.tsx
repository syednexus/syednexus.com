"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { GLOBE_HOTSPOTS } from "./hotspots";
import type { GlobeHotspot } from "./types";

type Props = {
  activeId: string | null;
  focusId?: string | null;
  onSelect: (hotspot: GlobeHotspot) => void;
  onHover?: (id: string | null) => void;
  onBackgroundClick?: () => void;
};

export default function MissionControlGlobeFallback({
  activeId,
  focusId = null,
  onSelect,
  onHover,
  onBackgroundClick
}: Props) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPulse(p => (p + 1) % 360), 50);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      onClick={() => onBackgroundClick?.()}
      onKeyDown={undefined}
      role="presentation"
    >
      <motion.div
        animate={focusId ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="relative h-[min(52vw,320px)] w-[min(52vw,320px)] sm:h-[min(42vw,380px)] sm:w-[min(42vw,380px)]"
      >
        <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_0_40px_rgba(34,211,238,0.25)]">
          <defs>
            <radialGradient id="globeGlow" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#164e63" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <filter id="hotspotGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="200" cy="200" r="148" fill="url(#globeGlow)" stroke="#22d3ee33" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="148" ry="42" fill="none" stroke="#22d3ee22" strokeWidth="0.8" />
          <ellipse cx="200" cy="200" rx="42" ry="148" fill="none" stroke="#22d3ee18" strokeWidth="0.8" />

          {GLOBE_HOTSPOTS.map((hotspot, index) => {
            const next = GLOBE_HOTSPOTS[(index + 1) % GLOBE_HOTSPOTS.length];
            const a = latLngToSvg(hotspot.lat, hotspot.lng);
            const b = latLngToSvg(next.lat, next.lng);
            const active = activeId === hotspot.id || focusId === hotspot.id;

            return (
              <g key={hotspot.id}>
                <path
                  d={`M ${a.x} ${a.y} Q 200 ${180 - index * 8} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="#22d3ee44"
                  strokeWidth="0.8"
                  strokeDasharray="4 6"
                />
                <circle
                  cx={a.x}
                  cy={a.y}
                  r={18}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    onSelect(hotspot);
                  }}
                  onMouseEnter={() => onHover?.(hotspot.id)}
                  onMouseLeave={() => onHover?.(null)}
                />
                <circle
                  cx={a.x}
                  cy={a.y}
                  r={active ? 12 : 8}
                  fill="none"
                  stroke="#22d3ee"
                  strokeOpacity={active ? 0.5 : 0.2}
                  strokeWidth={active ? 2 : 1}
                  pointerEvents="none"
                />
                <circle
                  cx={a.x}
                  cy={a.y}
                  r={active ? 9 : 6}
                  fill={active ? "#67e8f9" : "#22d3ee"}
                  fillOpacity={active ? 0.9 : 0.55}
                  filter="url(#hotspotGlow)"
                  pointerEvents="none"
                />
              </g>
            );
          })}

          {[...Array(24)].map((_, i) => {
            const angle = ((pulse + i * 15) * Math.PI) / 180;
            const x = 200 + Math.cos(angle) * (130 + (i % 3) * 8);
            const y = 200 + Math.sin(angle) * (60 + (i % 4) * 6);
            return (
              <circle key={i} cx={x} cy={y} r="1" fill="#22d3ee" fillOpacity={0.35 + (i % 5) * 0.08} />
            );
          })}
        </svg>
      </motion.div>

      <p className="absolute bottom-2 text-[9px] uppercase tracking-widest text-slate-600">
        SVG fallback · WebGL unavailable
      </p>
    </div>
  );
}

function latLngToSvg(lat: number, lng: number) {
  const x = 200 + (lng / 180) * 130;
  const y = 200 - (lat / 90) * 120;
  return { x, y };
}
