"use client";

import { useMemo } from "react";

import NexusWorkstationShell from "@/components/workspace/NexusWorkstationShell";
import { WorkstationProvider } from "@/components/workspace/WorkstationContext";
import type { PracticalMissionProps } from "@/components/engine/PracticalMissionProps";
import { useAnalyst } from "@/context/AnalystContext";
import { useMissions } from "@/context/MissionsContext";
import { useWorld } from "@/context/WorldContext";
import { applyChainToLayout, filterTrustedChainArtifacts } from "@/lib/world/incidentChain";
import { applyDesktopPreset, inferPresetFromModule } from "@/lib/world/desktopPresets";
import { buildWorkspaceLayout } from "@/lib/workspaceConfig";
import { resolvePracticalModule } from "@/lib/practicalConfig";
import { getOrganization } from "@/lib/world/organizations";
import WorldHud from "@/components/world/WorldHud";

export type NexusWorkstationProps = PracticalMissionProps & {
  variant?: "practical" | "soc";
  analystAnswer?: string;
  onAnalystAnswerChange?: (value: string) => void;
  onAnalystSubmit?: () => void;
};

export default function NexusWorkstation({
  mission,
  onAnswerChange,
  onSubmit,
  completed,
  submitting,
  result,
  debrief = null,
  variant = "practical",
  analystAnswer,
  onAnalystAnswerChange,
  onAnalystSubmit
}: NexusWorkstationProps) {
  const world = useWorld();
  const analyst = useAnalyst();
  const missions = useMissions();
  const serverCompletedSlugs = missions
    .filter(m => analyst.completedMissionIds.includes(m.id))
    .map(m => m.slug);
  const trustedArtifacts = filterTrustedChainArtifacts(
    world.getChainArtifacts(),
    serverCompletedSlugs
  );
  const layout = useMemo(() => {
    const base = buildWorkspaceLayout(mission, variant);
    const withChain = applyChainToLayout(base, mission, trustedArtifacts);
    const preset = world.desktopPreset ?? inferPresetFromModule(withChain.module);
    return applyDesktopPreset(withChain, preset);
  }, [mission, variant, world, trustedArtifacts]);
  const module = layout.module;
  const org = getOrganization(mission);

  return (
    <section className="mt-6 max-w-full overflow-hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-green-500">
          Nexus Workstation // {org.name} — {layout.vmName}
        </p>
        <WorldHud compact />
      </div>

      <WorkstationProvider
        mission={mission}
        layout={layout}
        completed={completed}
        submitting={submitting}
        result={result}
        onAnswerChange={onAnswerChange}
        onSubmit={onSubmit}
        analystAnswer={analystAnswer}
        onAnalystAnswerChange={onAnalystAnswerChange}
        onAnalystSubmit={onAnalystSubmit}
      >
        <NexusWorkstationShell />
      </WorkstationProvider>

      {completed && debrief && (
        <div className="mt-6 rounded-xl border border-green-800 p-5 text-gray-300">
          <h3 className="text-green-400">Debrief</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm">{debrief}</p>
        </div>
      )}
    </section>
  );
}

export { resolvePracticalModule };
