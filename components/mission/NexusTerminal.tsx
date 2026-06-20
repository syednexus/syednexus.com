"use client";

import { useState } from "react";

import { Mission } from "@/types/mission";

type NexusTerminalProps = {
  mission: Mission;
  onComplete: () => void;
  completed: boolean;
};

const starterLines = [
  "Nexus Terminal v3.1 — secure training shell",
  "Type `help` for available commands.",
  "Find the flag and submit with `submit <answer>`.",
];

export default function NexusTerminal({
  mission,
  onComplete,
  completed,
}: NexusTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    ...starterLines,
    "",
    `Mission loaded: ${mission.title}`,
    mission.description,
    "",
    "nexus@training:~$ ls",
    "briefing.txt  vault/  logs/",
  ]);

  function runCommand(command: string) {
    const trimmed = command.trim();
    const nextHistory = [...history, `nexus@training:~$ ${trimmed}`];

    if (!trimmed) {
      setHistory(nextHistory);
      return;
    }

    if (trimmed === "help") {
      nextHistory.push(
        "Commands: help, ls, cat briefing.txt, grep, submit <answer>, clear",
      );
      setHistory(nextHistory);
      return;
    }

    if (trimmed === "clear") {
      setHistory([...starterLines, "", `Mission loaded: ${mission.title}`]);
      return;
    }

    if (trimmed === "ls") {
      nextHistory.push("briefing.txt  vault/  logs/  .hidden/");
      setHistory(nextHistory);
      return;
    }

    if (trimmed === "cat briefing.txt") {
      nextHistory.push(
        `Objective: ${mission.title}`,
        "Hint: the vault unlock keyword is `nexus-${mission.slug}`",
      );
      setHistory(nextHistory);
      return;
    }

    if (trimmed.startsWith("grep")) {
      nextHistory.push(`logs/access.log: flag candidate -> nexus-${mission.slug}`);
      setHistory(nextHistory);
      return;
    }

    if (trimmed.startsWith("submit ")) {
      const answer = trimmed.replace("submit ", "").trim();
      if (answer === `nexus-${mission.slug}`) {
        nextHistory.push("ACCESS GRANTED — mission objective complete.");
        setHistory(nextHistory);
        if (!completed) {
          onComplete();
        }
        return;
      }

      nextHistory.push("Invalid answer. Review briefing.txt and grep logs/access.log");
      setHistory(nextHistory);
      return;
    }

    nextHistory.push(`command not found: ${trimmed.split(" ")[0]}`);
    setHistory(nextHistory);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-green-900/50 bg-black/60 font-mono text-sm backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-green-900/40 bg-green-950/30 px-4 py-2 text-xs uppercase tracking-widest text-gray-500">
        <span>Nexus Terminal</span>
        <span className="text-green-500">LINUX / COMMAND MODE</span>
      </div>

      <div className="max-h-80 overflow-y-auto px-4 py-4 text-green-300/90">
        {history.map((line, index) => (
          <p key={`${line}-${index}`} className="whitespace-pre-wrap leading-6">
            {line}
          </p>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-green-900/40 px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand(input);
          setInput("");
        }}
      >
        <span className="text-green-500">$</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={completed}
          className="flex-1 bg-transparent text-green-300 outline-none placeholder:text-gray-600"
          placeholder={completed ? "Mission completed" : "Enter command"}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
