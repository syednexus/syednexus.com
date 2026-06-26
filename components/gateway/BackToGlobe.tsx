"use client";

import Link from "next/link";

import { saveGlobeState } from "@/lib/globeState";

type Props = {
  focusId?: string | null;
  activeHotspot?: string | null;
  className?: string;
};

export default function BackToGlobe({
  focusId = null,
  activeHotspot = null,
  className = ""
}: Props) {
  return (
    <Link
      href="/"
      onClick={() => {
        saveGlobeState({
          focusId: focusId ?? activeHotspot,
          activeHotspot: activeHotspot ?? focusId,
          dockOpen: Boolean(focusId ?? activeHotspot)
        });
      }}
      className={`inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 ${className}`}
    >
      <span aria-hidden>←</span>
      Back to Globe
    </Link>
  );
}
