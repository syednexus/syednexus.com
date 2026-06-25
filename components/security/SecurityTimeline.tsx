"use client";

import type { ExportableSecurityLog } from "@/lib/security/exportSecurityLogs";

type SecurityTimelineProps = {
  logs: ExportableSecurityLog[];
  limit?: number;
};

function severityClass(severity: string): string {
  switch (severity) {
    case "CRITICAL":
      return "border-red-700/60 bg-red-950/30 text-red-300";
    case "HIGH":
      return "border-amber-700/60 bg-amber-950/30 text-amber-200";
    case "MEDIUM":
      return "border-yellow-800/50 bg-yellow-950/20 text-yellow-200/90";
    default:
      return "border-green-900/40 bg-black/40 text-gray-300";
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function actorLabel(log: ExportableSecurityLog): string {
  const parts: string[] = [];
  if (log.userEmail) parts.push(log.userEmail);
  if (log.ipAddress) parts.push(log.ipAddress);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

export default function SecurityTimeline({ logs, limit = 40 }: SecurityTimelineProps) {
  const timeline = logs.slice(0, limit);

  return (
    <section className="rounded-xl border border-green-900/40 bg-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-500">SOC Timeline</p>
          <h3 className="mt-1 text-lg font-semibold text-green-300">Security event stream</h3>
        </div>
        <p className="text-xs text-gray-600">{timeline.length} recent events</p>
      </div>

      <div className="space-y-2">
        {timeline.map(log => (
          <article
            key={log.id}
            className={`grid gap-2 rounded border px-3 py-2 text-sm sm:grid-cols-[72px_1fr_1fr_88px] ${severityClass(log.severity)}`}
          >
            <p className="font-mono text-xs opacity-80">{formatTime(log.createdAt)}</p>
            <p className="font-medium">{log.eventType}</p>
            <p className="truncate text-xs opacity-90">{actorLabel(log)}</p>
            <p className="text-xs font-bold uppercase tracking-wide">{log.severity}</p>
          </article>
        ))}

        {timeline.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">No timeline events available.</p>
        )}
      </div>
    </section>
  );
}
