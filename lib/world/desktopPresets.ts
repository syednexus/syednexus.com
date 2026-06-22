import type { WorkspaceLayout, WorkspaceWindowId } from "@/lib/workspaceConfig";
import { uniqueWindowIds } from "@/lib/workspaceConfig";

export type DesktopPresetId = "soc" | "kali" | "forensics" | "executive";

export type DesktopPreset = {
  id: DesktopPresetId;
  label: string;
  vmName: string;
  windows: WorkspaceWindowId[];
  description: string;
};

export const DESKTOP_PRESETS: Record<DesktopPresetId, DesktopPreset> = {
  soc: {
    id: "soc",
    label: "SOC Desktop",
    vmName: "Nexus SOC VM",
    windows: ["siem", "tickets", "wireshark", "files", "slack"],
    description: "Alert triage, tickets, and packet review."
  },
  kali: {
    id: "kali",
    label: "Kali VM",
    vmName: "Nexus Kali VM",
    windows: ["terminal", "nmap", "browser", "burp", "metasploit"],
    description: "Offensive security toolkit layout."
  },
  forensics: {
    id: "forensics",
    label: "Forensics VM",
    vmName: "Nexus Forensics VM",
    windows: ["files", "wireshark", "terminal", "network"],
    description: "Evidence analysis and timeline reconstruction."
  },
  executive: {
    id: "executive",
    label: "Executive Mode",
    vmName: "Nexus Executive VM",
    windows: ["inbox", "browser", "slack", "tickets"],
    description: "Briefings, comms, and stakeholder updates."
  }
};

export function applyDesktopPreset(
  layout: WorkspaceLayout,
  presetId: DesktopPresetId | null
): WorkspaceLayout {
  if (!presetId) return layout;
  const preset = DESKTOP_PRESETS[presetId];
  if (!preset) return layout;

  const mergedWindows = uniqueWindowIds([
    ...preset.windows,
    ...layout.defaultWindows
  ]);

  return {
    ...layout,
    vmName: preset.vmName,
    defaultWindows: mergedWindows
  };
}

export function inferPresetFromModule(module: string): DesktopPresetId | null {
  const map: Record<string, DesktopPresetId> = {
    soc: "soc",
    attack: "kali",
    forensics: "forensics",
    career: "executive",
    tools: "kali"
  };
  return map[module] ?? null;
}
