import type { AnalyticsEvent } from "@/lib/world/types";

const MAX_EVENTS = 500;

export function createAnalyticsEvent(
  type: AnalyticsEvent["type"],
  partial?: Omit<AnalyticsEvent, "id" | "type" | "at">
): AnalyticsEvent {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    at: Date.now(),
    ...partial
  };
}

export function trimAnalytics(events: AnalyticsEvent[]): AnalyticsEvent[] {
  return events.slice(-MAX_EVENTS);
}

export type AnalyticsSummary = {
  completionRate: number;
  dropOffRooms: Array<{ slug: string; count: number }>;
  hardRooms: Array<{ slug: string; abandonCount: number }>;
  topTools: Array<{ tool: string; count: number }>;
  totalEnters: number;
  totalCompletes: number;
};

export function summarizeAnalytics(events: AnalyticsEvent[]): AnalyticsSummary {
  const enters = new Map<string, number>();
  const completes = new Set<string>();
  const abandons = new Map<string, number>();
  const tools = new Map<string, number>();

  for (const event of events) {
    const slug = event.missionSlug ?? "unknown";
    if (event.type === "room_enter") {
      enters.set(slug, (enters.get(slug) ?? 0) + 1);
    }
    if (event.type === "room_complete") {
      completes.add(slug);
    }
    if (event.type === "room_abandon" || event.type === "drop_off") {
      abandons.set(slug, (abandons.get(slug) ?? 0) + 1);
    }
    if (event.type === "tool_use" && event.payload?.tool) {
      const tool = String(event.payload.tool);
      tools.set(tool, (tools.get(tool) ?? 0) + 1);
    }
  }

  const totalEnters = [...enters.values()].reduce((sum, n) => sum + n, 0);
  const totalCompletes = completes.size;
  const completionRate =
    totalEnters > 0 ? Math.round((totalCompletes / enters.size) * 100) : 0;

  const dropOffRooms = [...enters.entries()]
    .filter(([slug]) => !completes.has(slug))
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const hardRooms = [...abandons.entries()]
    .map(([slug, abandonCount]) => ({ slug, abandonCount }))
    .sort((a, b) => b.abandonCount - a.abandonCount)
    .slice(0, 8);

  const topTools = [...tools.entries()]
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    completionRate,
    dropOffRooms,
    hardRooms,
    topTools,
    totalEnters,
    totalCompletes
  };
}
