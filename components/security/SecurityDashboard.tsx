"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import SecurityTimeline from "@/components/security/SecurityTimeline";
import {
  downloadTextFile,
  securityLogsToCsv,
  type ExportableSecurityLog
} from "@/lib/security/exportSecurityLogs";
import type { MitreBreakdownEntry } from "@/lib/security/mitreMapper";
import {
  SECURITY_EVENT_TYPES,
  SECURITY_SEVERITIES
} from "@/lib/security/securityEvents";
import { useSound } from "@/context/SoundContext";

type ThreatScore = {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasons: string[];
};

type SecurityStats = {
  storageReady?: boolean;
  message?: string;
  error?: string;
  totalToday: number;
  failedLogins: number;
  mfaFailures: number;
  blockedApis: number;
  apiProbes: number;
  sudoAttempts: number;
  recoveryEvents: number;
  criticalAlerts: number;
  threatScore: ThreatScore;
  mitreBreakdown: MitreBreakdownEntry[];
  timeline: ExportableSecurityLog[];
  recentCriticalAlerts: ExportableSecurityLog[];
};

type SecurityLogRow = ExportableSecurityLog;

function alertMessage(log: SecurityLogRow): string {
  const metadata = log.metadata;
  if (metadata && typeof metadata.message === "string") {
    return metadata.message;
  }
  return `${log.eventType} detected`;
}

function threatScoreClass(level: ThreatScore["level"]): string {
  switch (level) {
    case "CRITICAL":
      return "text-red-400 border-red-700/60";
    case "HIGH":
      return "text-amber-400 border-amber-700/60";
    case "MEDIUM":
      return "text-yellow-300 border-yellow-700/50";
    default:
      return "text-green-400 border-green-700/50";
  }
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [logs, setLogs] = useState<SecurityLogRow[]>([]);
  const [severity, setSeverity] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const { playSound, triggerVisual } = useSound();
  const lastCriticalCountRef = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const fetchOptions: RequestInit = { credentials: "same-origin" };

      const [statsRes, logsRes] = await Promise.all([
        fetch("/api/security/logs", fetchOptions),
        fetch("/api/security/logs", {
          ...fetchOptions,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            severity: severity || undefined,
            eventType: eventType || undefined,
            limit: 250
          })
        })
      ]);

      const statsJson = (await statsRes.json()) as SecurityStats;
      const logsJson = (await logsRes.json()) as {
        logs: SecurityLogRow[];
        storageReady?: boolean;
        message?: string;
        error?: string;
      };

      if (!statsRes.ok) {
        throw new Error(statsJson.message ?? statsJson.error ?? "Unable to load security stats");
      }

      if (!logsRes.ok) {
        throw new Error(logsJson.message ?? logsJson.error ?? "Unable to load security logs");
      }

      setStats(statsJson);
      setLogs(logsJson.logs);

      if (statsJson.storageReady === false || logsJson.storageReady === false) {
        setError(
          statsJson.message ??
            logsJson.message ??
            "SecurityLog table is not ready. Run: npx prisma migrate deploy"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [severity, eventType]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!stats) return;
    const count = stats.recentCriticalAlerts?.length ?? stats.criticalAlerts ?? 0;
    if (count > lastCriticalCountRef.current) {
      playSound("security.critical");
      triggerVisual("critical");
    }
    lastCriticalCountRef.current = count;
  }, [stats, playSound, triggerVisual]);

  const exportLogs = useCallback(
    (format: "json" | "csv") => {
      if (logs.length === 0) return;

      setExporting(true);
      try {
        const stamp = new Date().toISOString().slice(0, 10);
        if (format === "json") {
          downloadTextFile(
            `nexus-security-audit-${stamp}.json`,
            JSON.stringify(logs, null, 2),
            "application/json"
          );
        } else {
          downloadTextFile(
            `nexus-security-audit-${stamp}.csv`,
            securityLogsToCsv(logs),
            "text/csv"
          );
        }
      } finally {
        setExporting(false);
      }
    },
    [logs]
  );

  const cards = stats
    ? [
        {
          label: "Threat score",
          value: stats.threatScore?.score ?? 0,
          suffix: stats.threatScore?.level ?? "LOW",
          highlight: true
        },
        { label: "Failed logins", value: stats.failedLogins },
        { label: "MFA failures", value: stats.mfaFailures },
        { label: "API probes", value: stats.apiProbes ?? stats.blockedApis },
        { label: "Sudo attempts", value: stats.sudoAttempts ?? 0 },
        { label: "Critical alerts", value: stats.criticalAlerts }
      ]
    : [];

  const criticalBanner = stats?.recentCriticalAlerts ?? [];
  const timeline = stats?.timeline ?? logs;

  return (
    <section className="mt-12 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-cyan-500">SOC Command Center</p>
        <h2 className="mt-2 text-2xl font-bold text-green-300">Security Operations Dashboard</h2>
        <p className="mt-2 text-sm text-gray-500">
          Owner-only telemetry. Secrets, tokens, and credentials are never stored.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-700/60 bg-amber-950/20 px-4 py-3 text-sm text-amber-200"
        >
          {error}
        </div>
      )}

      {stats?.storageReady === false && !error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-700/60 bg-amber-950/20 px-4 py-3 text-sm text-amber-200"
        >
          Security audit storage is not initialized. From the project root run:{" "}
          <code className="text-amber-100">npx prisma migrate deploy</code>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading SOC data…</p>}

      {stats?.threatScore && (
        <div
          className={`rounded-xl border bg-black/40 p-4 ${threatScoreClass(stats.threatScore.level)}`}
        >
          <p className="text-xs uppercase tracking-widest opacity-80">Current threat posture</p>
          <div className="mt-2 flex flex-wrap items-end gap-4">
            <p className="text-4xl font-bold">{stats.threatScore.score}</p>
            <p className="text-sm uppercase tracking-widest">{stats.threatScore.level}</p>
          </div>
          <ul className="mt-3 space-y-1 text-xs opacity-90">
            {stats.threatScore.reasons.map(reason => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {criticalBanner.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-700/60 bg-red-950/30 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">
            Critical alerts — last 24 hours
          </p>
          <ul className="mt-3 space-y-2">
            {criticalBanner.map(alert => (
              <li
                key={alert.id}
                className="rounded border border-red-900/40 bg-black/40 px-3 py-2 text-sm text-red-200"
              >
                <p className="font-medium">{alertMessage(alert)}</p>
                <p className="mt-1 text-xs text-red-300/80">
                  {new Date(alert.createdAt).toLocaleString()} · {alert.eventType}
                  {alert.ipAddress ? ` · ${alert.ipAddress}` : ""}
                  {alert.userEmail ? ` · ${alert.userEmail}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(card => (
            <div key={card.label} className="rounded-xl border border-green-900/40 bg-black/40 p-4">
              <p className="text-xs uppercase text-gray-500">{card.label}</p>
              <p
                className={`mt-2 text-3xl ${
                  card.label === "Critical alerts" && card.value > 0
                    ? "text-red-400"
                    : card.highlight
                      ? threatScoreClass(stats.threatScore.level).split(" ")[0]
                      : "text-amber-400"
                }`}
              >
                {card.value}
                {"suffix" in card && card.suffix ? (
                  <span className="ml-2 text-sm uppercase text-gray-500">{card.suffix}</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      )}

      {stats?.mitreBreakdown && stats.mitreBreakdown.length > 0 && (
        <section className="rounded-xl border border-purple-900/40 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-widest text-purple-400">MITRE ATT&CK mapping</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Technique</th>
                  <th className="px-3 py-2">Count</th>
                  <th className="px-3 py-2">Share</th>
                </tr>
              </thead>
              <tbody>
                {stats.mitreBreakdown.map(entry => (
                  <tr key={`${entry.category}-${entry.technique}`} className="border-t border-green-900/20">
                    <td className="px-3 py-2 text-purple-300">{entry.category}</td>
                    <td className="px-3 py-2 text-gray-300">{entry.technique}</td>
                    <td className="px-3 py-2 text-green-300">{entry.count}</td>
                    <td className="px-3 py-2 text-gray-400">{entry.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <SecurityTimeline logs={timeline} />

      <div className="flex flex-wrap gap-3">
        <select
          value={severity}
          onChange={event => setSeverity(event.target.value)}
          className="border border-green-900 bg-black px-3 py-2 text-sm"
        >
          <option value="">All severities</option>
          {SECURITY_SEVERITIES.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={eventType}
          onChange={event => setEventType(event.target.value)}
          className="border border-green-900 bg-black px-3 py-2 text-sm"
        >
          <option value="">All events</option>
          {SECURITY_EVENT_TYPES.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            void load();
          }}
          className="border border-green-700 px-4 py-2 text-sm text-green-300 hover:bg-green-950"
        >
          Refresh
        </button>

        <button
          type="button"
          disabled={logs.length === 0 || exporting}
          onClick={() => exportLogs("json")}
          className="border border-cyan-800 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-950 disabled:opacity-50"
        >
          Export JSON
        </button>

        <button
          type="button"
          disabled={logs.length === 0 || exporting}
          onClick={() => exportLogs("csv")}
          className="border border-cyan-800 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-950 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-green-900/40">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-green-950/20 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Endpoint</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-t border-green-900/20">
                <td className="px-4 py-3 text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-green-300">{log.eventType}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      log.severity === "CRITICAL"
                        ? "text-red-400"
                        : log.severity === "HIGH"
                          ? "text-amber-400"
                          : "text-gray-400"
                    }
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{log.userEmail ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{log.endpoint ?? "—"}</td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No security events found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
