"use client";

import { useWorld } from "@/context/WorldContext";
import { ORGANIZATIONS, type OrganizationId } from "@/lib/world/organizations";
import type { SaveSlotId } from "@/lib/world/types";

export default function VaultAnalyticsPage() {
  const { analyticsSummary, state, activeSlot, credits, reputation } = useWorld();
  const slot = state.slots[activeSlot as SaveSlotId];

  return (
    <main className="min-h-screen bg-black p-10 pt-28 font-mono text-green-400">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs text-gray-500">root@nexus:/vault/analytics#</p>
        <h1 className="mt-4 text-4xl font-bold">World Analytics</h1>
        <p className="mt-2 text-gray-500">
          Profile {activeSlot} · {credits} CR · REP {reputation}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-green-900/50 p-4">
            <p className="text-xs text-gray-600">Completion rate</p>
            <p className="text-3xl">{analyticsSummary.completionRate}%</p>
          </div>
          <div className="rounded border border-green-900/50 p-4">
            <p className="text-xs text-gray-600">Room enters</p>
            <p className="text-3xl">{analyticsSummary.totalEnters}</p>
          </div>
          <div className="rounded border border-green-900/50 p-4">
            <p className="text-xs text-gray-600">Rooms cleared</p>
            <p className="text-3xl">{analyticsSummary.totalCompletes}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg text-cyan-400">Drop-off rooms</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              {analyticsSummary.dropOffRooms.length === 0 && <li>None yet</li>}
              {analyticsSummary.dropOffRooms.map(room => (
                <li key={room.slug}>
                  {room.slug} — {room.count} enters, not completed
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg text-amber-400">Hard rooms (abandons)</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              {analyticsSummary.hardRooms.length === 0 && <li>None yet</li>}
              {analyticsSummary.hardRooms.map(room => (
                <li key={room.slug}>
                  {room.slug} — {room.abandonCount} abandons
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg text-purple-400">Best tools</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {analyticsSummary.topTools.map(tool => (
              <li key={tool.tool} className="rounded border border-purple-900/40 px-3 py-1 text-purple-300">
                {tool.tool} ({tool.count})
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-lg text-green-400">Unlocked contracts</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            {slot.unlockedContracts.length === 0 && <li>No contracts unlocked yet</li>}
            {slot.unlockedContracts.map((id: OrganizationId) => (
              <li key={id}>{ORGANIZATIONS[id].name}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
