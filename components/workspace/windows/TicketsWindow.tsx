"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

export default function TicketsWindow() {
  const { layout, setProgress, addEvidence } = useWorkstation();
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(layout.tickets.map(ticket => [ticket.id, ticket.status]))
  );

  function updateStatus(id: string, status: string) {
    setStatuses(current => ({ ...current, [id]: status }));
    addEvidence(`Ticket ${id} → ${status}`);
    setProgress(current => Math.min(90, current + 12));
    const ticket = layout.tickets.find(item => item.id === id);
    void ticket;
  }

  return (
    <div className="space-y-2 text-xs">
      {layout.tickets.map(ticket => (
        <div key={ticket.id} className="rounded border border-green-900/30 bg-green-950/10 p-2">
          <div className="flex items-center justify-between">
            <span className="text-green-400">{ticket.id}</span>
            <span
              className={
                ticket.severity === "critical"
                  ? "text-red-400"
                  : ticket.severity === "high"
                    ? "text-orange-400"
                    : "text-yellow-500"
              }
            >
              {ticket.severity}
            </span>
          </div>
          <p className="mt-1 text-white">{ticket.title}</p>
          <p className="text-gray-600">MITRE {ticket.mitre}</p>
          <p className="mt-1 text-gray-500">Status: {statuses[ticket.id]}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(["open", "investigating", "closed"] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => updateStatus(ticket.id, status)}
                disabled={false}
                className="border border-green-800 px-2 py-0.5 text-gray-400 hover:text-green-300"
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
