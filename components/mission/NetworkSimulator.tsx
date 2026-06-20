"use client";

import { useState } from "react";

import { Mission } from "@/types/mission";

type NetworkSimulatorProps = {
  mission: Mission;
  onComplete: () => void;
  completed: boolean;
};

const panels = [
  { label: "Capture", value: "training-lab.pcap" },
  { label: "Interface", value: "eth0" },
  { label: "Filter", value: "tcp || dns || icmp" },
];

export default function NetworkSimulator({
  mission,
  onComplete,
  completed,
}: NetworkSimulatorProps) {
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  const packets = [
    { id: 1, summary: "DNS query suspicious.example", flag: false },
    { id: 2, summary: "TCP 443 encrypted session", flag: false },
    {
      id: 3,
      summary: `HTTP POST /exfil credentials=${mission.slug}`,
      flag: true,
    },
    { id: 4, summary: "ICMP echo reply", flag: false },
  ];

  function submitAnalysis() {
    if (answer.trim() === String(packets.find((packet) => packet.flag)?.id)) {
      if (!completed) {
        onComplete();
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-green-900/50 bg-black/60 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-green-900/40 bg-green-950/30 px-4 py-2 text-xs uppercase tracking-widest text-gray-500">
        <span>Network Simulator</span>
        <span className="text-green-500">NETWORK / PCAP MODE</span>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
        <div className="space-y-3 rounded-xl border border-green-900/30 bg-black/40 p-3 text-xs">
          {panels.map((panel) => (
            <div key={panel.label}>
              <p className="uppercase tracking-widest text-gray-500">{panel.label}</p>
              <p className="mt-1 font-mono text-green-300">{panel.value}</p>
            </div>
          ))}
          <div>
            <p className="uppercase tracking-widest text-gray-500">Mission</p>
            <p className="mt-1 text-green-300">{mission.title}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Packet Stream
          </p>
          <div className="space-y-2">
            {packets.map((packet) => (
              <button
                key={packet.id}
                type="button"
                onClick={() => setSelectedPacket(packet.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left font-mono text-sm transition ${
                  selectedPacket === packet.id
                    ? "border-green-600 bg-green-950/40 text-green-200"
                    : "border-green-900/30 bg-black/30 text-gray-400 hover:border-green-800/60"
                }`}
              >
                #{packet.id} {packet.summary}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-green-900/30 bg-green-950/10 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Analysis Console
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Select the malicious packet and submit its ID to complete the scenario.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={completed}
                className="flex-1 rounded border border-green-900/40 bg-black/40 px-3 py-2 font-mono text-sm text-green-300 outline-none"
                placeholder="Packet ID"
              />
              <button
                type="button"
                disabled={completed}
                onClick={submitAnalysis}
                className="rounded border border-green-700 px-4 py-2 text-sm uppercase tracking-widest text-green-300 transition hover:bg-green-950/40 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
