"use client";

import { useState, type ComponentType } from "react";

import NexusRoom from "@/components/room/NexusRoom";
import PracticalEngine from "@/components/practical/PracticalEngine";
import MalwareSandbox from "@/components/malware/MalwareSandbox";
import PhishingAnalyzer from "@/components/phishing/PhishingAnalyzer";
import NexusSIEM from "@/components/siem/NexusSIEM";
import NexusTerminal from "@/components/terminal/NexusTerminal";
import NetworkSimulator from "@/components/engine/simulators/NetworkSimulator";
import { isPracticalMissionType, isSocMissionType } from "@/lib/practicalConfig";
import type { PublicMission } from "@/types/PublicMission";

type SimulatorComponent = ComponentType;

const SOC_SIMULATORS: Record<string, SimulatorComponent> = {
  SOC_ALERT: NexusSIEM,
  SIEM: NexusSIEM,
  PHISHING: PhishingAnalyzer,
  MALWARE: MalwareSandbox,
  THREAT_HUNT: NexusTerminal,
  INCIDENT_RESPONSE: NexusSIEM,
  NETWORK: NetworkSimulator,
  TERMINAL: NexusTerminal
};

export function resolveSimulator(type: string): SimulatorComponent {
  return SOC_SIMULATORS[type] ?? NexusSIEM;
}

export type MissionEngineProps = {
  mission: PublicMission;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  result: string;
  submitting?: boolean;
  completed?: boolean;
  debrief?: string | null;
};

function HintSection({
  mission,
  hints,
  revealedHints,
  onReveal,
  completed,
  label
}: {
  mission: PublicMission;
  hints: string[];
  revealedHints: number;
  onReveal: () => void;
  completed: boolean;
  label: string;
}) {
  if (hints.length === 0 || completed) return null;

  return (
    <section className="mt-10 rounded-xl border border-yellow-800 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl text-yellow-400">{label}</h2>
        {revealedHints < hints.length && (
          <button
            type="button"
            onClick={onReveal}
            className="border border-yellow-600 px-4 py-2 text-yellow-300 transition hover:bg-yellow-950"
          >
            REVEAL HINT {revealedHints + 1} / {hints.length}
          </button>
        )}
      </div>
      {revealedHints > 0 && (
        <ul className="mt-5 space-y-3">
          {hints.slice(0, revealedHints).map((hint, index) => (
            <li
              key={`${mission.id}-hint-${index}`}
              className="rounded-lg border border-yellow-900/60 bg-yellow-950/20 px-4 py-3 text-gray-300"
            >
              <span className="text-yellow-500">Hint {index + 1}:</span> {hint}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function MissionEngine({
  mission,
  answer,
  onAnswerChange,
  onSubmit,
  result,
  submitting = false,
  completed = false,
  debrief = null
}: MissionEngineProps) {
  const hints: string[] = [];
  const [revealedHints, setRevealedHints] = useState(0);
  const isPractical = isPracticalMissionType(mission.type);
  const isSoc = isSocMissionType(mission.type);

  function revealNextHint() {
    setRevealedHints(current => Math.min(current + 1, hints.length));
  }

  if (isPractical) {
    return (
      <PracticalEngine
        mission={mission}
        onAnswerChange={onAnswerChange}
        onSubmit={onSubmit}
        completed={completed}
        submitting={submitting}
        result={result}
        debrief={debrief}
      />
    );
  }

  if (isSoc) {
    return (
      <NexusRoom
        mission={mission}
        variant="soc"
        onAnswerChange={onAnswerChange}
        onSubmit={onSubmit}
        completed={completed}
        submitting={submitting}
        result={result}
        analystAnswer={answer}
        onAnalystAnswerChange={onAnswerChange}
        onAnalystSubmit={onSubmit}
      />
    );
  }

  const Simulator = resolveSimulator(mission.type);
  return (
    <>
      <section className="mt-10 rounded-xl border border-blue-800 p-6">
        <h2 className="text-xl">EVIDENCE LOGS</h2>
        {mission.content && (
          <pre className="mt-5 overflow-auto whitespace-pre-wrap text-gray-300">{mission.content}</pre>
        )}
        <div className="mt-8">
          <Simulator />
        </div>
      </section>
      <HintSection
        mission={mission}
        hints={hints}
        revealedHints={revealedHints}
        onReveal={revealNextHint}
        completed={completed}
        label="ANALYST HINTS"
      />
      <section className="mt-10 rounded-xl border border-red-800 p-6">
        <p>ANALYST RESPONSE</p>
        <input
          value={answer}
          onChange={event => onAnswerChange(event.target.value)}
          placeholder="Submit investigation result"
          disabled={submitting || completed}
          className="mt-5 w-full border border-green-600 bg-black p-4 outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || completed || !answer.trim()}
          className="mt-5 border border-green-500 px-6 py-3 transition hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "SUBMITTING..." : completed ? "MISSION COMPLETE" : "SUBMIT ANALYSIS"}
        </button>
        {result && (
          <p className={`mt-8 text-xl ${result.includes("GRANTED") ? "text-green-400" : "text-red-400"}`}>
            {result}
          </p>
        )}
        {completed && debrief && (
          <div className="mt-8 rounded-xl border border-green-800 p-5 text-gray-300">
            <h3 className="text-green-400">ANALYSIS REPORT</h3>
            <p className="mt-4 whitespace-pre-wrap">{debrief}</p>
          </div>
        )}
      </section>
    </>
  );
}
