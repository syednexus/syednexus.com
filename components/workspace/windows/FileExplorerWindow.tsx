"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { parsePracticalConfig } from "@/lib/practicalConfig";
import EvidenceViewer from "@/components/forensics/EvidenceViewer";

function toHexPreview(content: string) {
  return content
    .slice(0, 64)
    .split("")
    .map(char => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

export default function FileExplorerWindow() {
  const {
    layout,
    mission,
    selectedFile,
    setSelectedFile,
    addEvidence,
    completeLab,
    trackAction,
    completed,
    submitting,
    evidence
  } = useWorkstation();
  const practical = parsePracticalConfig(mission);
  const hashInfo = practical.forensics?.hash;
  const showForensicsViewer = layout.module === "forensics" || Boolean(practical.forensics);
  const [hashInput, setHashInput] = useState("");
  const [folder, setFolder] = useState<"case" | "logs" | "memory" | "artifacts">("case");

  const folderFiles = layout.files.filter(file => {
    if (folder === "case") return !file.name.includes("/");
    const prefix =
      folder === "logs"
        ? /log|auth|sys/i
        : folder === "memory"
          ? /mem|dump|hiber/i
          : /pcap|hash|miner|ioc|evidence/i;
    return prefix.test(file.name);
  });
  const visibleFiles = folderFiles.length > 0 ? folderFiles : layout.files;

  function verifyHash() {
    const value = hashInput.trim().toLowerCase();
    const expected = (hashInfo?.md5 ?? "").toLowerCase();
    if (expected && value === expected) {
      trackAction("hash_verified", value);
      completeLab(value);
    }
  }

  return (
    <div className="flex h-full gap-3">
      <div className="flex w-36 shrink-0 flex-col gap-2 border-r border-green-900/30 pr-2 text-xs">
        <p className="text-[10px] uppercase text-gray-600">Evidence</p>
        {(["case", "logs", "memory", "artifacts"] as const).map(name => (
          <button
            key={name}
            type="button"
            onClick={() => setFolder(name)}
            className={`rounded px-2 py-1 text-left ${folder === name ? "bg-green-950/50 text-green-300" : "text-gray-600"}`}
          >
            /{name}
          </button>
        ))}
        <ul className="min-h-0 flex-1 space-y-1 overflow-auto">
        {visibleFiles.map(file => (
          <li key={file.name}>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(file);
                trackAction("file_open", file.name);
                addEvidence(`Reviewed: ${file.name}`);
              }}
              className={`w-full rounded px-2 py-1 text-left ${
                selectedFile?.name === file.name ? "bg-green-950/50 text-green-300" : "text-gray-500"
              }`}
            >
              {file.name}
            </button>
          </li>
        ))}
        </ul>
      </div>

      <div className="min-w-0 flex-1 space-y-3 text-xs">
        {selectedFile ? (
          <>
            <div className="rounded border border-green-900/30 bg-black/40 p-2">
              <p className="text-gray-600">Metadata</p>
              <p className="mt-1 text-green-400">{selectedFile.name}</p>
              <p className="text-gray-600">Type: {selectedFile.type}</p>
              <p className="text-gray-600">Size: {selectedFile.size ?? "—"}</p>
            </div>
            <div className="rounded border border-green-900/30 bg-black/40 p-2">
              <p className="text-gray-600">Preview</p>
              <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap text-green-300">
                {selectedFile.content}
              </pre>
            </div>
            <div className="rounded border border-green-900/30 bg-black/40 p-2">
              <p className="text-gray-600">Timeline</p>
              <p className="mt-1 text-gray-500">
                {selectedFile.modified ?? "Unknown"} — accessed during investigation
              </p>
            </div>
            <div className="rounded border border-green-900/30 bg-black/40 p-2">
              <p className="text-gray-600">Hex (first 64 bytes)</p>
              <p className="mt-1 break-all font-mono text-[10px] text-cyan-600">{toHexPreview(selectedFile.content)}</p>
            </div>
            {hashInfo && (
              <div className="rounded border border-cyan-900/30 bg-cyan-950/10 p-2">
                <p className="text-cyan-500">Hash Checker</p>
                <p className="mt-1 text-gray-500">Reference MD5: {hashInfo.md5}</p>
                <input
                  value={hashInput}
                  onChange={event => setHashInput(event.target.value)}
                  disabled={completed || submitting}
                  placeholder="Enter hash to verify"
                  className="mt-2 w-full border border-cyan-900/40 bg-black px-2 py-1 text-cyan-300 outline-none"
                />
                <button
                  type="button"
                  onClick={verifyHash}
                  disabled={completed || submitting}
                  className="mt-2 w-full border border-cyan-700 py-1 text-cyan-400 hover:bg-cyan-950/30"
                >
                  Verify integrity
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600">Select a file from the evidence folder.</p>
        )}

        {showForensicsViewer && (
          <EvidenceViewer mission={mission} selectedFile={selectedFile} evidence={evidence} />
        )}
      </div>
    </div>
  );
}
