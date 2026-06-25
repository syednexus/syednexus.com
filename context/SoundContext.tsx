"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { usePathname } from "next/navigation";

import { nexusAudio, playSound, stopAiThinking, unlockNexusAudio } from "@/lib/audio/nexusAudio";
import {
  STORAGE_KEYS,
  SOUND_THEMES,
  type SoundEvent,
  type SoundTheme
} from "@/lib/audio/soundEvents";
import { triggerVisualFeedback, type VisualFeedbackType } from "@/lib/ui/visualFeedback";

type LegacySoundType = "click" | "success" | "alert" | "specialist" | "achievement";

const LEGACY_SOUND_MAP: Record<LegacySoundType, SoundEvent> = {
  click: "ui.click",
  success: "answer.correct",
  alert: "answer.wrong",
  specialist: "security.critical",
  achievement: "mission.complete"
};

type SoundContextValue = {
  enabled: boolean;
  volume: number;
  theme: SoundTheme;
  setEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  setTheme: (theme: SoundTheme) => void;
  playSound: (event: SoundEvent) => void;
  triggerVisual: (type: VisualFeedbackType) => void;
  /** @deprecated Use playSound(event) */
  play: (type?: LegacySoundType) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [enabled, setEnabledState] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [theme, setThemeState] = useState<SoundTheme>("auto");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedEnabled = localStorage.getItem(STORAGE_KEYS.enabled);
    const legacyEnabled = localStorage.getItem("nexus_sound");
    const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

    if (savedEnabled === "true" || legacyEnabled === "true") setEnabledState(true);
    if (savedVolume) {
      const parsed = Number.parseFloat(savedVolume);
      if (!Number.isNaN(parsed)) setVolumeState(parsed);
    }
    if (savedTheme && SOUND_THEMES.includes(savedTheme as SoundTheme)) {
      setThemeState(savedTheme as SoundTheme);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    nexusAudio.configure({ enabled, volume, theme, pathname });
  }, [enabled, volume, theme, pathname, hydrated]);

  useEffect(() => {
    const unlock = () => unlockNexusAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    localStorage.setItem(STORAGE_KEYS.enabled, String(next));
    nexusAudio.setEnabled(next);
  }, []);

  const toggleSound = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    setVolumeState(clamped);
    localStorage.setItem(STORAGE_KEYS.volume, String(clamped));
    nexusAudio.setVolume(clamped);
  }, []);

  const setTheme = useCallback((next: SoundTheme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
    nexusAudio.setTheme(next);
  }, []);

  const play = useCallback((type: LegacySoundType = "click") => {
    playSound(LEGACY_SOUND_MAP[type]);
  }, []);

  const triggerVisual = useCallback((type: VisualFeedbackType) => {
    triggerVisualFeedback(type);
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({
      enabled,
      volume,
      theme,
      setEnabled,
      toggleSound,
      setVolume,
      setTheme,
      playSound,
      triggerVisual,
      play
    }),
    [enabled, volume, theme, setEnabled, toggleSound, setVolume, setTheme, play, triggerVisual]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("SoundProvider missing");
  return ctx;
}

/** Backward-compatible alias */
export function useNexusSound() {
  return useSound();
}

export function SoundProviderAsNexus({ children }: { children: ReactNode }) {
  return <SoundProvider>{children}</SoundProvider>;
}
