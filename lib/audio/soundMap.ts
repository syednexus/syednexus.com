import type { ResolvedSoundTheme, SoundEvent } from "@/lib/audio/soundEvents";

type SoundPathMap = Partial<Record<ResolvedSoundTheme | "common", string>>;

/** Event → relative filename inside theme/common folder. */
export const SOUND_EVENT_PATHS: Record<SoundEvent, SoundPathMap> = {
  "ui.click": { common: "click.wav" },
  "ui.hover": { common: "click.wav" },
  "ui.panel.open": { common: "success.wav" },
  "ui.panel.close": { common: "click.wav" },
  "ui.switch": { common: "click.wav" },
  "auth.login.success": { vault: "unlock.wav", common: "success.wav" },
  "auth.login.failed": { vault: "denied.wav", common: "error.wav" },
  "mfa.success": { vault: "unlock.wav" },
  "mfa.failed": { vault: "denied.wav", common: "error.wav" },
  "vault.unlock": { vault: "unlock.wav" },
  "vault.lock": { vault: "denied.wav" },
  "terminal.open": { shadow: "unlock.wav", defender: "scan.wav", common: "click.wav" },
  "terminal.command": { shadow: "sudo.wav", defender: "scan.wav", common: "click.wav" },
  "terminal.error": { shadow: "denied.wav", common: "error.wav" },
  "sudo.request": { shadow: "sudo.wav" },
  "sudo.accepted": { shadow: "unlock.wav", vault: "unlock.wav" },
  "sudo.denied": { shadow: "denied.wav", vault: "denied.wav", common: "error.wav" },
  "mission.start": { defender: "scan.wav", medcore: "scan.wav", common: "click.wav" },
  "mission.complete": { common: "success.wav", medcore: "complete.wav" },
  "mission.failed": { common: "error.wav" },
  "answer.correct": { common: "success.wav", medcore: "complete.wav" },
  "answer.wrong": { common: "error.wav", shadow: "denied.wav" },
  "hint.open": { defender: "alert.wav", common: "click.wav" },
  "evidence.collect": { defender: "scan.wav", medcore: "scan.wav", common: "click.wav" },
  "ai.open": { common: "click.wav" },
  "ai.thinking": { defender: "scan.wav", medcore: "scan.wav", shadow: "sudo.wav" },
  "ai.response": { common: "success.wav", medcore: "complete.wav" },
  "ai.error": { common: "error.wav" },
  "security.log": { common: "click.wav" },
  "security.warning": { defender: "alert.wav" },
  "security.critical": { defender: "alert.wav", vault: "denied.wav" }
};

const PRELOAD_PATHS = [
  "/sounds/common/click.wav",
  "/sounds/common/success.wav",
  "/sounds/common/error.wav",
  "/sounds/defender/scan.wav",
  "/sounds/defender/alert.wav",
  "/sounds/shadow/sudo.wav",
  "/sounds/shadow/denied.wav",
  "/sounds/shadow/unlock.wav",
  "/sounds/medcore/scan.wav",
  "/sounds/medcore/complete.wav",
  "/sounds/vault/unlock.wav",
  "/sounds/vault/denied.wav"
];

export function resolveSoundAsset(
  event: SoundEvent,
  theme: ResolvedSoundTheme
): string | null {
  const mapping = SOUND_EVENT_PATHS[event];
  const order: Array<ResolvedSoundTheme | "common"> =
    theme === "minimal" ? ["common"] : [theme, "common"];

  for (const bucket of order) {
    const file = mapping[bucket];
    if (file) {
      return `/sounds/${bucket === "common" ? "common" : bucket}/${file}`;
    }
  }

  return null;
}

export function getPreloadAssets(): string[] {
  return PRELOAD_PATHS;
}

export function resolveAutoTheme(pathname: string, ownerShellActive = false): ResolvedSoundTheme {
  if (pathname.startsWith("/vault")) return "vault";
  if (pathname.startsWith("/medcore")) return "medcore";
  if (ownerShellActive) return "shadow";
  if (
    pathname.startsWith("/soc") ||
    pathname.startsWith("/forensics") ||
    pathname.startsWith("/attack") ||
    pathname.startsWith("/siem") ||
    pathname.startsWith("/mission/") ||
    pathname.startsWith("/terminal")
  ) {
    return "defender";
  }
  return "defender";
}
