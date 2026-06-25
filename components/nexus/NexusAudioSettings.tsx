"use client";

import { useSound } from "@/context/SoundContext";
import { SOUND_THEMES, type SoundTheme } from "@/lib/audio/soundEvents";

type NexusAudioSettingsProps = {
  compact?: boolean;
  className?: string;
};

export default function NexusAudioSettings({
  compact = false,
  className = ""
}: NexusAudioSettingsProps) {
  const { enabled, toggleSound, volume, setVolume, theme, setTheme } = useSound();

  return (
    <div
      className={`rounded border border-green-900/50 bg-black/80 p-3 font-mono text-xs text-green-300 ${className}`}
    >
      {!compact && (
        <p className="mb-2 text-[10px] uppercase tracking-widest text-cyan-500">Nexus Audio</p>
      )}

      <div className={`flex ${compact ? "flex-wrap items-center gap-2" : "flex-col gap-3"}`}>
        <button
          type="button"
          onClick={toggleSound}
          className="rounded border border-green-800 px-2 py-1 hover:bg-green-950"
          aria-label={enabled ? "Mute Nexus audio" : "Enable Nexus audio"}
        >
          {enabled ? "Sound ON" : "Sound OFF"}
        </button>

        {enabled && (
          <label className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}>
            <span className="text-gray-500">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={event => setVolume(Number.parseFloat(event.target.value))}
              className={`accent-green-500 ${compact ? "w-20" : "w-full"}`}
              aria-label="Nexus audio volume"
            />
          </label>
        )}

        <label className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}>
          <span className="text-gray-500">Theme</span>
          <select
            value={theme}
            onChange={event => setTheme(event.target.value as SoundTheme)}
            className="min-w-0 flex-1 border border-green-900 bg-black px-2 py-1 text-green-300"
            aria-label="Nexus audio theme"
          >
            {SOUND_THEMES.map(item => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
