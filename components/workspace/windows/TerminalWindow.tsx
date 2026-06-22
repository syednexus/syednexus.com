"use client";

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { parseLabConfig, resolveReconCommand } from "@/lib/labConfig";
import {
  autocomplete,
  findFiles,
  grepInFile,
  listDirectory,
  NEXUS_LAB_FS,
  normalizePath,
  readFile,
  resolvePath
} from "@/lib/simulatedFilesystem";

export default function TerminalWindow() {
  const { mission, layout, completed, submitting, completeLab, addEvidence, trackAction, setProgress } =
    useWorkstation();
  const config = useMemo(() => parseLabConfig(mission), [mission]);
  const target = config.target ?? layout.targetHost;
  const inputRef = useRef<HTMLInputElement>(null);

  const [cwd, setCwd] = useState("/home/operator");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [output, setOutput] = useState<string[]>([
    "Nexus Kali VM — simulated filesystem (no real OS execution)",
    `Target scope: ${target}`,
    "Type 'help' for commands. Use ↑/↓ for history, Tab to autocomplete.",
    ""
  ]);
  const [input, setInput] = useState("");

  const prompt = `operator@nexus-kali:${cwd}$`;

  const runSingleCommand = useCallback(
    (line: string): string => {
      const trimmed = line.trim();
      if (!trimmed) return "";

      const tokens = trimmed.split(/\s+/);
      const cmd = tokens[0]?.toLowerCase() ?? "";
      const args = tokens.slice(1);
      trackAction("command", trimmed);

      if (cmd === "help") {
        return "Commands: ls, cd, cat, grep, find, chmod, ps, netstat, pwd, whoami, history, nmap, submit\nPipes: cat file | grep keyword";
      }
      if (cmd === "pwd") return cwd;
      if (cmd === "whoami") return "operator";
      if (cmd === "history") {
        return cmdHistory.length
          ? cmdHistory.map((entry, index) => `${index + 1}  ${entry}`).join("\n")
          : "(no commands in history)";
      }
      if (cmd === "cd") {
        const next = normalizePath(cwd, args[0] ?? "/home/operator");
        if (!resolvePath(next, NEXUS_LAB_FS)) return `cd: ${args[0]}: No such file or directory`;
        setCwd(next);
        return "";
      }
      if (cmd === "ls") {
        const path = args[0] ? normalizePath(cwd, args[0]) : cwd;
        return listDirectory(path, NEXUS_LAB_FS);
      }
      if (cmd === "cat") {
        return readFile(normalizePath(cwd, args[0] ?? ""), NEXUS_LAB_FS);
      }
      if (cmd === "grep") {
        if (args.length === 1) return "grep: missing file operand";
        return grepInFile(normalizePath(cwd, args[1] ?? ""), args[0] ?? "", NEXUS_LAB_FS);
      }
      if (cmd === "find") {
        const path = normalizePath(cwd, args[0] ?? "/");
        const pattern = args[1] ?? "*";
        const found = findFiles(path, pattern, NEXUS_LAB_FS);
        return found.length ? found.join("\n") : "";
      }
      if (cmd === "chmod") {
        return `chmod: simulated — permissions updated on ${args[1] ?? args[0] ?? "file"}`;
      }
      if (cmd === "ps") {
        return "PID  CMD\n442  sshd\n991  suspicious_miner (check /tmp/.miner)";
      }
      if (cmd === "netstat") {
        return "tcp 0.0.0.0:22 LISTEN\ntcp 0.0.0.0:80 LISTEN\ntcp 10.0.0.5:443 ESTABLISHED";
      }
      if (cmd === "submit") {
        const ans = args.join(" ");
        if (!ans) return "Usage: submit <finding>";
        trackAction("finding_submitted", ans);
        completeLab(ans);
        return "Submitting finding for server validation...";
      }

      const resolved = resolveReconCommand(trimmed, config, target);
      if (resolved) {
        addEvidence(`Terminal: ${trimmed}`);
        setProgress(current => Math.min(90, current + 12));
        return resolved;
      }

      if (cmd === "nmap") {
        addEvidence("nmap scan");
        return `Starting Nmap 7.94 (simulated)\nNmap scan report for ${target}\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n443/tcp open https`;
      }

      return `bash: ${cmd}: command not found (simulated environment)`;
    },
    [cwd, cmdHistory, config, target, trackAction, addEvidence, setProgress, completeLab]
  );

  const runPipeline = useCallback(
    (line: string): string => {
      const segments = line.split("|").map(segment => segment.trim());
      let pipeInput = "";

      for (const segment of segments) {
        const tokens = segment.split(/\s+/);
        const cmd = tokens[0]?.toLowerCase() ?? "";

        if (cmd === "grep") {
          const pattern = tokens[1] ?? "";
          const file = tokens[2];
          if (file) {
            pipeInput = grepInFile(normalizePath(cwd, file), pattern, NEXUS_LAB_FS);
          } else if (pipeInput) {
            const re = new RegExp(pattern, "i");
            pipeInput = pipeInput.split("\n").filter(row => re.test(row)).join("\n");
          }
          continue;
        }

        if (cmd === "cat" && pipeInput) {
          return pipeInput;
        }

        pipeInput = runSingleCommand(segment);
      }
      return pipeInput;
    },
    [cwd, runSingleCommand]
  );

  const execute = useCallback(
    (line: string) => {
      const result = line.includes("|") ? runPipeline(line) : runSingleCommand(line);
      setOutput(current => [...current, `${prompt} ${line}`, result, ""]);
      setCmdHistory(history => [...history, line]);
      setHistoryIndex(null);
    },
    [prompt, runPipeline, runSingleCommand]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      execute(input);
      setInput("");
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (cmdHistory.length === 0) return;
      const index = historyIndex === null ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(cmdHistory[index] ?? "");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const index = historyIndex + 1;
      if (index >= cmdHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(index);
        setInput(cmdHistory[index] ?? "");
      }
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const suggestion = autocomplete(input, cwd);
      if (suggestion) setInput(suggestion);
    }
  };

  return (
    <div className="flex h-full flex-col" onClick={() => inputRef.current?.focus()}>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-green-300">
        {output.join("\n")}
      </pre>
      <div className="mt-2 flex items-center gap-2 border-t border-green-900/40 pt-2">
        <span className="shrink-0 text-[10px] text-green-600">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={completed || submitting}
          className="min-w-0 flex-1 bg-transparent text-xs text-green-300 outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
