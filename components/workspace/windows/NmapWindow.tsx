"use client";

import { useMemo, useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { parseLabConfig } from "@/lib/labConfig";
import { parsePracticalConfig } from "@/lib/practicalConfig";

const TOOL_OUTPUTS: Record<string, string> = {
  nmap: `PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1
80/tcp open  http    Apache httpd 2.4.57
443/tcp open https   nginx 1.24.0

Service detection performed.
Possible CVEs:
  CVE-2021-44228 (Log4j) — investigate /api endpoints
  CVE-2023-25690 (Apache) — review mod_proxy config`,
  hydra: "[22][ssh] host: target login: admin password: admin123",
  john: "Loaded 1 hash (md5)\npassword123 (user)",
  hashcat: "Recovered: 1/1 digests — password123"
};

export default function NmapWindow() {
  const { mission, layout, completed, submitting, addEvidence, trackAction, setProgress } = useWorkstation();
  const lab = useMemo(() => parseLabConfig(mission), [mission]);
  const practical = useMemo(() => parsePracticalConfig(mission), [mission]);
  const tool = practical.tool?.tool ?? "nmap";
  const [target, setTarget] = useState(lab.target ?? layout.targetHost);
  const [flags, setFlags] = useState(practical.tool?.defaultCommand ?? "nmap -sV -sC");
  const [output, setOutput] = useState("Ready — configure scan and run simulation.");

  function runScan() {
    const simulated =
      practical.tool?.output ?? lab.commands?.[flags] ?? TOOL_OUTPUTS[tool] ?? TOOL_OUTPUTS.nmap;
    setOutput(`$ ${flags} ${target}\n${simulated}`);
    addEvidence(`${tool} scan on ${target}`);
    trackAction("command", `${flags} ${target}`);
    setProgress(current => Math.min(90, current + 25));
  }

  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <label className="text-gray-600">
        Target
        <input
          value={target}
          onChange={event => setTarget(event.target.value)}
          className="mt-1 w-full border border-green-900/40 bg-black px-2 py-1.5 text-green-300 outline-none"
        />
      </label>
      <label className="text-gray-600">
        Command flags
        <input
          value={flags}
          onChange={event => setFlags(event.target.value)}
          disabled={completed || submitting}
          className="mt-1 w-full border border-green-900/40 bg-black px-2 py-1.5 text-green-300 outline-none"
        />
      </label>
      <button
        type="button"
        onClick={runScan}
        disabled={completed || submitting}
        className="border border-green-600 py-1.5 text-green-400 hover:bg-green-950"
      >
        Run simulated scan
      </button>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap rounded border border-green-900/30 bg-black/50 p-2 text-green-300">
        {output}
      </pre>
    </div>
  );
}
