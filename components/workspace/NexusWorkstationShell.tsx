"use client";

import TopBar from "@/components/workspace/TopBar";
import LeftPanel from "@/components/workspace/LeftPanel";
import RightPanel from "@/components/workspace/RightPanel";
import WindowManager from "@/components/workspace/WindowManager";
import NexusMentor from "@/components/mentor/NexusMentor";

export default function NexusWorkstationShell() {
  return (
    <div className="flex h-[min(82vh,820px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-green-900/60 bg-[#050805] font-mono text-green-400 shadow-inner sm:min-h-[560px]">
      <TopBar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <LeftPanel />
        <div className="relative min-h-[280px] min-w-0 flex-1 bg-[radial-gradient(circle_at_20%_20%,#0a1a0a,#050805_55%)] lg:min-h-0">
          <WindowManager />
        </div>
        <div className="flex max-h-[40vh] flex-col border-t border-green-900/50 lg:max-h-none lg:border-l lg:border-t-0">
          <RightPanel />
          <NexusMentor />
        </div>
      </div>
    </div>
  );
}
