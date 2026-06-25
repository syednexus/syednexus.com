"use client";

import { useState } from "react";

import TopBar from "@/components/workspace/TopBar";
import LeftPanel from "@/components/workspace/LeftPanel";
import RightPanel from "@/components/workspace/RightPanel";
import WindowManager from "@/components/workspace/WindowManager";
import NexusMentor from "@/components/mentor/NexusMentor";

type MobileTab = "briefing" | "tools" | "notes";

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: "briefing", label: "Briefing" },
  { id: "tools", label: "Tools" },
  { id: "notes", label: "Submit" }
];

export default function NexusWorkstationShell() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("tools");

  return (
    // Explicit height on ALL breakpoints so h-full works throughout the tree.
    // Mobile: 88vh so the workstation fits in one screen without needing to scroll.
    <div className="flex h-[min(88vh,820px)] min-h-[440px] flex-col overflow-hidden rounded-xl border border-green-900/60 bg-[#050805] font-mono text-green-400 shadow-inner lg:h-[min(82vh,820px)] lg:min-h-[560px]">
      <TopBar />

      {/* Mobile-only tab bar — hidden on desktop */}
      <div className="flex shrink-0 border-b border-green-900/30 lg:hidden">
        {MOBILE_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            className={`flex-1 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors ${
              mobileTab === tab.id
                ? "bg-green-950/60 text-green-300"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">

        {/* ── Left panel: tasks / hints / files ─────────────────────── */}
        {/* Mobile: shown only when "briefing" tab is active */}
        <div className={`min-h-0 min-w-0 flex-1 overflow-hidden lg:contents ${mobileTab === "briefing" ? "flex flex-col" : "hidden"} lg:flex`}>
          <LeftPanel />
        </div>

        {/* ── Main canvas: tool windows ─────────────────────────────── */}
        {/* Mobile: shown only when "tools" tab is active */}
        <div
          className={`relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#0a1a0a,#050805_55%)] lg:min-h-0 ${
            mobileTab === "tools" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          }`}
        >
          <WindowManager />
        </div>

        {/* ── Right panel: notes / evidence / submit ────────────────── */}
        {/* Mobile: shown only when "notes" tab is active */}
        <div
          className={`flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden border-green-900/50 lg:w-56 lg:shrink-0 lg:border-l ${
            mobileTab === "notes" ? "flex flex-1 flex-col border-t" : "hidden lg:flex"
          }`}
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <RightPanel />
          </div>
          <NexusMentor />
        </div>

      </div>
    </div>
  );
}
