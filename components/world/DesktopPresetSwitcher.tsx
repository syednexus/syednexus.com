"use client";

import { DESKTOP_PRESETS, type DesktopPresetId } from "@/lib/world/desktopPresets";
import { useWorld } from "@/context/WorldContext";

export default function DesktopPresetSwitcher() {
  const { desktopPreset, setDesktopPreset } = useWorld();

  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-gray-600">Desktop</span>
      {(Object.keys(DESKTOP_PRESETS) as DesktopPresetId[]).map(id => (
        <button
          key={id}
          type="button"
          title={DESKTOP_PRESETS[id].description}
          onClick={() => setDesktopPreset(desktopPreset === id ? null : id)}
          className={`rounded border px-2 py-0.5 text-[10px] ${
            desktopPreset === id
              ? "border-cyan-500 text-cyan-300"
              : "border-green-900/50 text-gray-600 hover:text-green-500"
          }`}
        >
          {DESKTOP_PRESETS[id].label}
        </button>
      ))}
    </div>
  );
}
