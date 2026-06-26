"use client";

import { useCallback, useEffect, useState } from "react";

type HealthPayload = {
  status: "ok" | "degraded";
  timestamp: string;
  database: boolean;
  redis: "connected" | "fallback-memory" | "unavailable";
  rls: "enabled" | "disabled";
  environment: "development" | "production";
  version: string;
  signals?: {
    cloudflare: boolean;
    securityHeaders: boolean;
    dockerProbe: boolean;
  };
};

type IndicatorTone = "green" | "yellow" | "red";

type StatusRow = {
  label: string;
  tone: IndicatorTone;
  detail: string;
};

function toneClass(tone: IndicatorTone): string {
  if (tone === "green") return "bg-green-500";
  if (tone === "yellow") return "bg-amber-400";
  return "bg-red-500";
}

function StatusDot({ tone }: { tone: IndicatorTone }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${toneClass(tone)}`} aria-hidden />;
}

export default function PlatformSecurityStatus() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [healthRes, mfaRes] = await Promise.all([
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/auth/mfa/status", { cache: "no-store" })
      ]);

      const healthData = (await healthRes.json()) as HealthPayload;
      setHealth(healthData);
      setLastCheck(new Date().toISOString());

      if (mfaRes.ok) {
        const mfaData = (await mfaRes.json()) as { mfaEnabled?: boolean };
        setMfaEnabled(Boolean(mfaData.mfaEnabled));
      } else {
        setMfaEnabled(null);
      }
    } catch (loadError) {
      setHealth(null);
      setError(loadError instanceof Error ? loadError.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows: StatusRow[] = health
    ? [
        {
          label: "Database",
          tone: health.database ? "green" : "red",
          detail: health.database ? "Connected" : "Unavailable"
        },
        {
          label: "Redis",
          tone:
            health.redis === "connected"
              ? "green"
              : health.redis === "fallback-memory"
                ? "yellow"
                : "red",
          detail:
            health.redis === "connected"
              ? "Connected"
              : health.redis === "fallback-memory"
                ? "In-memory fallback"
                : "Unavailable"
        },
        {
          label: "Cloudflare",
          tone: health.signals?.cloudflare ? "green" : health.environment === "production" ? "yellow" : "yellow",
          detail: health.signals?.cloudflare ? "Edge detected" : "Not detected on last probe"
        },
        {
          label: "MFA",
          tone: mfaEnabled === true ? "green" : mfaEnabled === false ? "yellow" : "yellow",
          detail:
            mfaEnabled === true
              ? "Enabled"
              : mfaEnabled === false
                ? "Not enabled"
                : "Status unavailable"
        },
        {
          label: "RLS",
          tone: health.rls === "enabled" ? "green" : "red",
          detail: health.rls === "enabled" ? "Enabled" : "Disabled"
        },
        {
          label: "Docker Health",
          tone: health.status === "ok" ? "green" : "red",
          detail: health.status === "ok" ? "Passing" : "Degraded"
        },
        {
          label: "Security Headers",
          tone: health.signals?.securityHeaders || health.environment === "development" ? "green" : "yellow",
          detail:
            health.signals?.securityHeaders || health.environment === "development"
              ? "Active"
              : "Review production config"
        }
      ]
    : [];

  return (
    <section className="rounded-xl border border-cyan-900/40 bg-black/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-500">Platform Security Status</p>
          <p className="mt-1 text-sm text-gray-500">
            Live posture from `/api/health` and MFA status. No secrets are exposed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void load();
          }}
          className="border border-cyan-800 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-950"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-amber-300">
          {error}
        </p>
      )}

      {loading && <p className="mt-4 text-sm text-gray-500">Checking platform health…</p>}

      {!loading && health && (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {rows.map(row => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded border border-green-900/30 bg-black/30 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <StatusDot tone={row.tone} />
                  <span>{row.label}</span>
                </div>
                <span className="text-xs text-gray-500">{row.detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              Last Health Check:{" "}
              <span className="text-gray-400">
                {lastCheck ? new Date(lastCheck).toLocaleString() : "—"}
              </span>
            </span>
            <span>
              API version: <span className="text-gray-400">{health.version}</span>
            </span>
            <span>
              Environment: <span className="text-gray-400">{health.environment}</span>
            </span>
          </div>
        </>
      )}
    </section>
  );
}
