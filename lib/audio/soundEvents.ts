export const SOUND_THEMES = ["auto", "defender", "shadow", "medcore", "minimal"] as const;

export type SoundTheme = (typeof SOUND_THEMES)[number];

export type ResolvedSoundTheme = "defender" | "shadow" | "medcore" | "vault" | "minimal";

export const SOUND_EVENTS = [
  "ui.click",
  "ui.hover",
  "ui.panel.open",
  "ui.panel.close",
  "ui.switch",
  "auth.login.success",
  "auth.login.failed",
  "mfa.success",
  "mfa.failed",
  "vault.unlock",
  "vault.lock",
  "terminal.open",
  "terminal.command",
  "terminal.error",
  "sudo.request",
  "sudo.accepted",
  "sudo.denied",
  "mission.start",
  "mission.complete",
  "mission.failed",
  "answer.correct",
  "answer.wrong",
  "hint.open",
  "evidence.collect",
  "ai.open",
  "ai.thinking",
  "ai.response",
  "ai.error",
  "security.log",
  "security.warning",
  "security.critical"
] as const;

export type SoundEvent = (typeof SOUND_EVENTS)[number];

export const STORAGE_KEYS = {
  enabled: "nexus_sound_enabled",
  volume: "nexus_sound_volume",
  theme: "nexus_sound_theme"
} as const;
