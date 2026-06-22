"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

type Tab = "dashboard" | "alerts" | "timeline" | "ioc";

export default function SIEMWindow() {
  const { layout, addEvidence, trackAction, setProgress, completed, submitting } = useWorkstation();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selectedAlert, setSelectedAlert] = useState(layout.alerts[0]?.id ?? "");
  const [ticketStatus, setTicketStatus] = useState<Record<string, string>>({});
  const [iocSearch, setIocSearch] = useState("");
  const [verdict, setVerdict] = useState<"open" | "true_positive" | "false_positive">("open");

  const alert = layout.alerts.find(item => item.id === selectedAlert) ?? layout.alerts[0];
  const critical = layout.alerts.filter(item => item.severity === "critical").length;
  const high = layout.alerts.filter(item => item.severity === "high").length;

  function investigate(alertId: string) {
    setTicketStatus(current => ({ ...current, [alertId]: "investigating" }));
    trackAction("siem_alert", alertId);
    addEvidence(`SIEM alert ${alertId} under investigation`);
    setProgress(current => Math.min(90, current + 20));
  }

  function setCaseVerdict(type: "true_positive" | "false_positive") {
    setVerdict(type);
    trackAction("siem_verdict", type);
    const submission = `${type}:${alert?.mitre ?? ""}`;
    addEvidence(`Verdict recorded: ${submission}`);
  }

  function searchIoc() {
    trackAction("siem_alert", `ioc:${iocSearch}`);
    addEvidence(`IOC search: ${iocSearch}`);
  }

  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <div className="flex gap-1 border-b border-blue-900/30 pb-1">
        {(["dashboard", "alerts", "timeline", "ioc"] as Tab[]).map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`px-2 py-1 capitalize ${tab === item ? "text-blue-300" : "text-gray-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-red-950/30 p-2 text-center">
            <p className="text-red-400">{critical}</p>
            <p className="text-gray-600">Critical</p>
          </div>
          <div className="rounded bg-orange-950/30 p-2 text-center">
            <p className="text-orange-400">{high}</p>
            <p className="text-gray-600">High</p>
          </div>
          <div className="rounded bg-blue-950/30 p-2 text-center">
            <p className="text-blue-400">{layout.alerts.length}</p>
            <p className="text-gray-600">Total alerts</p>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <ul className="max-h-28 space-y-1 overflow-auto">
          {layout.alerts.map(item => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedAlert(item.id);
                  investigate(item.id);
                }}
                className={`w-full rounded px-2 py-1 text-left ${selectedAlert === item.id ? "bg-blue-950/40" : ""}`}
              >
                <span className="text-purple-400">{item.mitre}</span> {item.rule} — {item.severity}
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === "timeline" && alert && (
        <div className="space-y-1 text-gray-500">
          <p>{alert.time} — Alert triggered: {alert.rule}</p>
          <p>+2m — Analyst assigned</p>
          <p>+5m — Endpoint logs correlated</p>
          <p>+8m — Verdict: {verdict.replace("_", " ")}</p>
        </div>
      )}

      {tab === "ioc" && (
        <div className="flex gap-2">
          <input
            value={iocSearch}
            onChange={event => setIocSearch(event.target.value)}
            placeholder="Search IP, hash, domain..."
            className="min-w-0 flex-1 border border-blue-900/40 bg-black px-2 py-1 outline-none"
          />
          <button type="button" onClick={searchIoc} className="border border-blue-700 px-2 text-blue-400">
            Search
          </button>
        </div>
      )}

      {alert && (
        <div className="mt-auto rounded border border-blue-900/40 bg-blue-950/10 p-2">
          <p className="text-blue-300">{alert.id}</p>
          <p className="mt-1 text-gray-500">{alert.log}</p>
          <p className="mt-1 text-purple-400">MITRE {alert.mitre}</p>
          <p className="text-gray-600">Status: {ticketStatus[alert.id] ?? "open"}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setCaseVerdict("true_positive")}
              disabled={completed || submitting}
              className="border border-red-700 px-2 py-0.5 text-red-400 disabled:opacity-50"
            >
              True Positive
            </button>
            <button
              type="button"
              onClick={() => setCaseVerdict("false_positive")}
              disabled={completed || submitting}
              className="border border-gray-700 px-2 py-0.5 text-gray-400 disabled:opacity-50"
            >
              False Positive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
