"use client";

import TopBar from "@/components/workspace/TopBar";
import LeftPanel from "@/components/workspace/LeftPanel";
import RightPanel from "@/components/workspace/RightPanel";
import WindowManager from "@/components/workspace/WindowManager";
import NexusMentor from "@/components/mentor/NexusMentor";

export default function NexusWorkstationShell() {
  return (
    <>
      {/* Mobile experience notice */}
      <p className="mb-3 rounded border border-yellow-900/50 bg-yellow-950/20 px-3 py-2 text-xs text-yellow-500/80 lg:hidden">
        ⚡ Best experienced on desktop. Scroll down to access all panels.
      </p>

      <div className="flex flex-col overflow-hidden rounded-xl border border-green-900/60 bg-[#050805] font-mono text-green-400 shadow-inner lg:h-[min(82vh,820px)] lg:min-h-[560px]">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Tasks/hints/files panel — collapses on mobile */}
          <div className="lg:contents">
            <LeftPanel />
          </div>

          {/* Main workspace canvas */}
          <div className="relative min-h-[280px] min-w-0 flex-1 bg-[radial-gradient(circle_at_20%_20%,#0a1a0a,#050805_55%)] lg:min-h-0">
            <WindowManager />
          </div>

          {/* Notes / progress / mentor panel */}
          <div className="flex flex-col border-t border-green-900/50 lg:max-h-none lg:border-l lg:border-t-0">
            <RightPanel />
            <NexusMentor />
          </div>
        </div>
      </div>
    </>
  );
}
