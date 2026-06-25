"use client";

import { useEffect, useMemo, useState } from "react";

import { sha256Hex } from "@/lib/forensics/hash";
import type { WorkspaceFile } from "@/lib/workspaceConfig";
import { parsePracticalConfig } from "@/lib/practicalConfig";
import type { PublicMission } from "@/types/PublicMission";

type EvidenceViewerProps = {
  mission: PublicMission;
  selectedFile: WorkspaceFile | null;
  evidence: string[];
};

export default function EvidenceViewer({
  mission,
  selectedFile,
  evidence
}: EvidenceViewerProps) {
  const practical = parsePracticalConfig(mission);
  const timeline = practical.forensics?.timeline ?? [];
  const hashInfo = practical.forensics?.hash;
  const [sha256, setSha256] = useState<string>("");

  useEffect(() => {
    if (!selectedFile) {
      setSha256("");
      return;
    }

    let cancelled = false;
    void sha256Hex(selectedFile.content).then(value => {
      if (!cancelled) setSha256(value);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedFile]);

  const iocList = useMemo(() => {
    const fromEvidence = evidence.filter(item => /ioc|hash|ip|domain|c2|malware/i.test(item));
    const fromConfig = timeline
      .filter(entry => entry.suspicious)
      .map(entry => `${entry.time} ${entry.event}`);
    return [...new Set([...fromEvidence, ...fromConfig])];
  }, [evidence, timeline]);

  return (
    <section className="mt-3 space-y-3 rounded border border-cyan-900/40 bg-cyan-950/10 p-3 text-xs">
      <p className="text-[10px] uppercase tracking-wider text-cyan-400">Digital Evidence Viewer</p>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded border border-green-900/30 bg-black/40 p-2">
          <p className="text-gray-600">File hash</p>
          {selectedFile ? (
            <>
              <p className="mt-1 break-all font-mono text-[10px] text-green-300">
                SHA256: {sha256 || "calculating…"}
              </p>
              {hashInfo?.md5 && (
                <p className="mt-1 text-gray-500">Reference MD5: {hashInfo.md5}</p>
              )}
              {hashInfo?.sha256 && (
                <p className="mt-1 text-gray-500">Reference SHA256: {hashInfo.sha256}</p>
              )}
            </>
          ) : (
            <p className="mt-1 text-gray-600">Select a file to compute integrity hash.</p>
          )}
        </div>

        <div className="rounded border border-green-900/30 bg-black/40 p-2">
          <p className="text-gray-600">Chain of custody</p>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li>Collector: Nexus analyst workstation</li>
            <li>Storage: in-session evidence locker</li>
            <li>Items logged: {evidence.length}</li>
            <li>Status: {selectedFile ? "Under review" : "Awaiting selection"}</li>
          </ul>
        </div>
      </div>

      <div className="rounded border border-green-900/30 bg-black/40 p-2">
        <p className="text-gray-600">Timeline events</p>
        <ul className="mt-2 max-h-28 space-y-1 overflow-auto">
          {timeline.length === 0 && (
            <li className="text-gray-600">No structured timeline in mission config.</li>
          )}
          {timeline.map((entry, index) => (
            <li
              key={`${entry.time}-${index}`}
              className={entry.suspicious ? "text-amber-300" : "text-gray-400"}
            >
              {entry.time} — {entry.event}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border border-green-900/30 bg-black/40 p-2">
        <p className="text-gray-600">IOC list</p>
        <ul className="mt-2 max-h-24 space-y-1 overflow-auto">
          {iocList.length === 0 && <li className="text-gray-600">Collect artifacts to populate IOCs.</li>}
          {iocList.map(item => (
            <li key={item} className="break-all text-cyan-300 [overflow-wrap:anywhere]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
