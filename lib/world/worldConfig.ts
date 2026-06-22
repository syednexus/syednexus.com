import type { PublicMission } from "@/types/PublicMission";

import type { OrganizationId } from "@/lib/world/organizations";
import type { WorldMissionMeta } from "@/lib/world/types";

function parseMarkerBlock(raw: string, marker: string): Record<string, unknown> | null {
  const index = raw.indexOf(marker);
  if (index < 0) return null;
  try {
    return JSON.parse(raw.slice(index + marker.length).trim()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseWorldMissionMeta(mission: PublicMission): WorldMissionMeta {
  const raw = mission.content?.trim() ?? "";
  const block =
    parseMarkerBlock(raw, "WORLD_CONFIG:") ??
    (raw.startsWith("{")
      ? (() => {
          try {
            return JSON.parse(raw) as Record<string, unknown>;
          } catch {
            return null;
          }
        })()
      : null);

  const world = (block?.world ?? block) as Record<string, unknown> | undefined;
  if (!world) return { organizationId: "nexus-security" };

  const inject = world.injectInto;
  return {
    organizationId: (world.organizationId as OrganizationId) ?? "nexus-security",
    chainId: typeof world.chainId === "string" ? world.chainId : undefined,
    chainStep: typeof world.chainStep === "number" ? world.chainStep : undefined,
    chainOutputKey: typeof world.chainOutputKey === "string" ? world.chainOutputKey : undefined,
    prerequisiteSlug: typeof world.prerequisiteSlug === "string" ? world.prerequisiteSlug : undefined,
    injectInto: Array.isArray(inject)
      ? (inject.filter(item => typeof item === "string") as WorldMissionMeta["injectInto"])
      : undefined,
    careerDay: typeof world.careerDay === "number" ? world.careerDay : undefined
  };
}

export function buildWorldContent(
  brief: string,
  meta: WorldMissionMeta
): string {
  const json = JSON.stringify({ world: meta });
  return brief.trim() ? `${brief.trim()}\n\nWORLD_CONFIG:${json}` : `WORLD_CONFIG:${json}`;
}
