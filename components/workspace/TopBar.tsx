"use client";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import DesktopPresetSwitcher from "@/components/world/DesktopPresetSwitcher";
import { getOrganization } from "@/lib/world/organizations";

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TopBar() {
  const { mission, layout, elapsedSeconds } = useWorkstation();
  const org = getOrganization(mission);

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-green-900/50 bg-black/60 px-4 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-green-300">
          <span className="text-gray-600">Client</span> {org.name}
        </span>
        <span className="text-green-300">
          <span className="text-gray-600">VM</span> {layout.vmName}
        </span>
        <span>
          <span className="text-gray-600">Target</span> {layout.targetHost}
        </span>
        <span className="text-cyan-400">
          <span className="text-gray-600">Timer</span> {formatTimer(elapsedSeconds)}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
        <DesktopPresetSwitcher />
        <span className="flex items-center gap-1.5 text-green-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
          VPN Connected
        </span>
        <span className="rounded border border-green-900 px-2 py-0.5 text-gray-500">lab-net</span>
      </div>
    </header>
  );
}
