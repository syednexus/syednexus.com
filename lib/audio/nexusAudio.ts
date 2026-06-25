import {
  getPreloadAssets,
  resolveAutoTheme,
  resolveSoundAsset
} from "@/lib/audio/soundMap";
import type { ResolvedSoundTheme, SoundEvent, SoundTheme } from "@/lib/audio/soundEvents";

const DEBOUNCE_MS = 100;

type EngineConfig = {
  enabled: boolean;
  volume: number;
  theme: SoundTheme;
  ownerShellActive: boolean;
  pathname: string;
};

class NexusAudioEngine {
  private cache = new Map<string, HTMLAudioElement>();
  private missing = new Set<string>();
  private lastPlayed = new Map<string, number>();
  private thinkingAsset: string | null = null;
  private unlocked = false;
  private config: EngineConfig = {
    enabled: false,
    volume: 0.6,
    theme: "auto",
    ownerShellActive: false,
    pathname: "/"
  };

  configure(partial: Partial<EngineConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  unlockFromUserGesture(): void {
    if (this.unlocked || typeof window === "undefined") return;
    this.unlocked = true;
    this.preloadCommon();
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    for (const audio of this.cache.values()) {
      audio.volume = this.config.volume;
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stopThinking();
    }
  }

  setTheme(theme: SoundTheme): void {
    this.config.theme = theme;
  }

  setRouteContext(pathname: string, ownerShellActive = false): void {
    this.config.pathname = pathname;
    this.config.ownerShellActive = ownerShellActive;
  }

  private resolveTheme(): ResolvedSoundTheme {
    if (this.config.theme === "auto") {
      return resolveAutoTheme(this.config.pathname, this.config.ownerShellActive);
    }
    if (this.config.theme === "minimal") return "minimal";
    return this.config.theme;
  }

  private preloadCommon(): void {
    for (const asset of getPreloadAssets()) {
      void this.loadAudio(asset);
    }
  }

  private loadAudio(assetPath: string): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (this.missing.has(assetPath)) return null;

    const cached = this.cache.get(assetPath);
    if (cached) return cached;

    const audio = new Audio(assetPath);
    audio.preload = "auto";
    audio.volume = this.config.volume;

    audio.addEventListener(
      "error",
      () => {
        this.missing.add(assetPath);
        this.cache.delete(assetPath);
      },
      { once: true }
    );

    this.cache.set(assetPath, audio);
    return audio;
  }

  private playAsset(assetPath: string, loop = false): void {
    const base = this.loadAudio(assetPath);
    if (!base) return;

    const audio = loop ? base : (base.cloneNode(true) as HTMLAudioElement);
    audio.volume = this.config.theme === "minimal" ? this.config.volume * 0.45 : this.config.volume;
    audio.loop = loop;

    void audio.play().catch(() => {
      this.missing.add(assetPath);
    });
  }

  playSound(event: SoundEvent, themeOverride?: ResolvedSoundTheme): void {
    if (typeof window === "undefined") return;
    if (!this.unlocked || !this.config.enabled) return;

    const debounceKey = themeOverride ? `${event}:${themeOverride}` : event;
    const now = Date.now();
    const last = this.lastPlayed.get(debounceKey) ?? 0;
    if (now - last < DEBOUNCE_MS) return;
    this.lastPlayed.set(debounceKey, now);

    const theme = themeOverride ?? this.resolveTheme();
    const asset = resolveSoundAsset(event, theme);
    if (!asset) return;

    if (event === "ai.thinking") {
      this.startThinking(asset);
      return;
    }

    this.stopThinking();
    this.playAsset(asset);
  }

  startThinking(assetPath?: string): void {
    this.stopThinking();
    const theme = this.resolveTheme();
    const asset = assetPath ?? resolveSoundAsset("ai.thinking", theme);
    if (!asset) return;

    this.thinkingAsset = asset;
    const base = this.loadAudio(asset);
    if (!base) return;

    base.loop = true;
    base.volume =
      (this.config.theme === "minimal" ? this.config.volume * 0.35 : this.config.volume) * 0.55;
    void base.play().catch(() => {
      this.missing.add(asset);
    });
  }

  stopThinking(): void {
    if (!this.thinkingAsset) return;

    const audio = this.cache.get(this.thinkingAsset);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }

    this.thinkingAsset = null;
  }
}

export const nexusAudio = new NexusAudioEngine();

export function playSound(event: SoundEvent, themeOverride?: ResolvedSoundTheme): void {
  nexusAudio.playSound(event, themeOverride);
}

export function stopAiThinking(): void {
  nexusAudio.stopThinking();
}

export function unlockNexusAudio(): void {
  nexusAudio.unlockFromUserGesture();
}
