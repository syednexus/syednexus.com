"use client";

import { useMemo, useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { parseLabConfig } from "@/lib/labConfig";

export default function MetasploitWindow() {
  const { mission, layout, completed, submitting, addEvidence, trackAction, setProgress } = useWorkstation();
  const config = useMemo(() => parseLabConfig(mission), [mission]);
  const msf = config.msf;
  const [search, setSearch] = useState(msf?.searchTerm ?? "ms17");
  const [module, setModule] = useState(msf?.module ?? "exploit/windows/smb/ms17_010_eternalblue");
  const [output, setOutput] = useState("msf6 > use auxiliary/scanner/portscan/tcp");
  const [stage, setStage] = useState<"search" | "use" | "run">("search");

  function runSearch() {
    setOutput(`[*] Searching for ${search}...\n${module}  rank: excellent  Disclosure: 2017-0143`);
    setStage("use");
    addEvidence(`MSF search: ${search}`);
    setProgress(current => Math.min(80, current + 15));
  }

  function useModule() {
    setOutput(`msf6 exploit(${module.split("/").pop()}) > set RHOSTS ${layout.targetHost}\nmsf6 exploit > run`);
    setStage("run");
  }

  function exploit() {
    const success =
      msf?.successOutput ??
      "[*] Sending stage...\n[+] Meterpreter session 1 opened (simulated training environment)";
    setOutput(success);
    addEvidence("Metasploit exploit executed (simulated)");
    trackAction("command", `exploit ${module}`);
    setProgress(95);
  }

  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <div className="flex gap-2">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          disabled={completed || submitting}
          className="min-w-0 flex-1 border border-red-900/40 bg-black px-2 py-1 text-red-300 outline-none"
          placeholder="search term"
        />
        <button type="button" onClick={runSearch} className="border border-red-700 px-2 text-red-400">
          search
        </button>
      </div>
      <input
        value={module}
        onChange={event => setModule(event.target.value)}
        disabled={completed || submitting}
        className="border border-red-900/40 bg-black px-2 py-1 text-red-300 outline-none"
      />
      <div className="flex gap-2">
        {stage !== "search" && (
          <button type="button" onClick={useModule} className="border border-red-700 px-2 text-red-400">
            use
          </button>
        )}
        {stage === "run" && (
          <button
            type="button"
            onClick={exploit}
            disabled={completed || submitting}
            className="border border-red-500 px-2 text-red-300"
          >
            exploit
          </button>
        )}
      </div>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap rounded bg-black/50 p-2 text-red-200/80">{output}</pre>
    </div>
  );
}
