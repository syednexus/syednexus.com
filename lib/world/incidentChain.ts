import type { PublicMission } from "@/types/PublicMission";

import type {
  WorkspaceAlert,
  WorkspaceFile,
  WorkspaceLayout,
  WorkspaceTicket
} from "@/lib/workspaceConfig";
import type { ChainArtifact } from "@/lib/world/types";
import { parseWorldMissionMeta } from "@/lib/world/worldConfig";

export function getChainArtifactsForMission(
  artifacts: ChainArtifact[],
  mission: PublicMission
): ChainArtifact[] {
  const meta = parseWorldMissionMeta(mission);
  if (!meta.chainId) return [];
  return artifacts.filter(
    item => item.chainId === meta.chainId && item.missionSlug !== mission.slug
  );
}

export function isChainUnlocked(
  mission: PublicMission,
  serverCompletedSlugs: string[]
): boolean {
  const meta = parseWorldMissionMeta(mission);
  if (!meta.prerequisiteSlug) return true;
  return serverCompletedSlugs.includes(meta.prerequisiteSlug);
}

export function filterTrustedChainArtifacts(
  artifacts: ChainArtifact[],
  serverCompletedSlugs: string[]
): ChainArtifact[] {
  return artifacts.filter(artifact => serverCompletedSlugs.includes(artifact.missionSlug));
}

export function buildChainOutput(
  mission: PublicMission,
  evidence: string[],
  analystAnswer: string
): ChainArtifact | null {
  const meta = parseWorldMissionMeta(mission);
  if (!meta.chainId || !meta.chainOutputKey) return null;

  const value =
    analystAnswer.trim() ||
    evidence[evidence.length - 1] ||
    `ioc-${mission.slug}`;

  return {
    chainId: meta.chainId,
    missionSlug: mission.slug,
    outputKey: meta.chainOutputKey,
    outputValue: value,
    createdAt: Date.now()
  };
}

function artifactToSiemAlert(artifact: ChainArtifact, index: number): WorkspaceAlert {
  return {
    id: `CHAIN-${index + 1}`,
    time: "08:00:00",
    rule: `Prior incident carryover — ${artifact.outputKey}`,
    severity: "high",
    host: "carried-forward",
    mitre: "T1071",
    log: artifact.outputValue
  };
}

function artifactToFile(artifact: ChainArtifact): WorkspaceFile {
  return {
    name: `${artifact.outputKey}.ioc`,
    type: "doc",
    content: `Chain artifact from ${artifact.missionSlug}:\n${artifact.outputValue}`,
    size: "4 KB",
    modified: "carried forward"
  };
}

function artifactToTicket(artifact: ChainArtifact, index: number): WorkspaceTicket {
  return {
    id: `INC-CHAIN-${index + 1}`,
    title: `Follow-up: ${artifact.outputKey}`,
    severity: "high",
    status: "open",
    mitre: "T1071",
    assignee: "you"
  };
}

export function applyChainToLayout(
  layout: WorkspaceLayout,
  mission: PublicMission,
  artifacts: ChainArtifact[]
): WorkspaceLayout {
  const meta = parseWorldMissionMeta(mission);
  const relevant = getChainArtifactsForMission(artifacts, mission);
  if (relevant.length === 0) return layout;

  const inject = meta.injectInto ?? ["siem", "files"];
  const next = { ...layout };

  if (inject.includes("siem")) {
    next.alerts = [
      ...relevant.map(artifactToSiemAlert),
      ...layout.alerts
    ];
  }
  if (inject.includes("files")) {
    next.files = [...relevant.map(artifactToFile), ...layout.files];
  }
  if (inject.includes("tickets")) {
    next.tickets = [
      ...relevant.map(artifactToTicket),
      ...layout.tickets
    ];
  }
  if (inject.includes("inbox")) {
    const inboxNote: WorkspaceFile = {
      name: "prior-incident-brief.eml",
      type: "doc",
      content: relevant
        .map(item => `From ${item.missionSlug}: ${item.outputKey} = ${item.outputValue}`)
        .join("\n"),
      size: "6 KB"
    };
    next.files = [inboxNote, ...next.files];
  }

  return next;
}

export function chainPositionLabel(mission: PublicMission): string | null {
  const meta = parseWorldMissionMeta(mission);
  if (!meta.chainId || !meta.chainStep) return null;
  return `${meta.chainId} — Step ${meta.chainStep}`;
}
