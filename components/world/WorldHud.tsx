"use client";

import { useWorld } from "@/context/WorldContext";
import { SAVE_SLOTS } from "@/lib/world/saveSlots";
import { formatCredits } from "@/lib/world/credits";
import { formatDynamicStat, useMounted } from "@/hooks/useMounted";

export default function WorldHud({ compact = false }: { compact?: boolean }) {
  const mounted = useMounted();
  const {
    credits,
    reputation,
    reputationLabel,
    activeSlot,
    setActiveSlot,
    slotLabel,
    isSuperMode
  } = useWorld();

  const creditsDisplay = formatDynamicStat(
    mounted,
    formatCredits(credits, { superMode: isSuperMode }),
    "— CR"
  );
  const repDisplay = formatDynamicStat(mounted, reputation, "—");
  const slotName = formatDynamicStat(mounted, slotLabel(activeSlot), "—");

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-[10px] text-gray-500">
        <span className="text-amber-400">{creditsDisplay}</span>
        <span>REP {repDisplay}</span>
        <span>{slotName}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-green-900/40 bg-black/40 px-3 py-2 text-xs">
      <span className="text-amber-400">{creditsDisplay}</span>
      <span className="text-cyan-400">REP {repDisplay}</span>
      {mounted && <span className="text-gray-500">{reputationLabel}</span>}
      {mounted && isSuperMode && (
        <span className="text-red-400 uppercase tracking-wider">Super</span>
      )}
      <div className="flex gap-1">
        {SAVE_SLOTS.map(slot => (
          <button
            key={slot}
            type="button"
            onClick={() => setActiveSlot(slot)}
            disabled={!mounted}
            className={`border px-2 py-0.5 ${
              activeSlot === slot
                ? "border-green-500 text-green-400"
                : "border-green-900/50 text-gray-600 hover:text-gray-400"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
