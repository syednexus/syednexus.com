"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

const DEVICES = [
  { id: "internet", label: "Internet", x: 10, y: 40, ports: [] as string[] },
  { id: "firewall", label: "Firewall", x: 28, y: 40, ports: ["443", "22 filtered"] },
  { id: "router", label: "Router", x: 46, y: 40, ports: ["NAT", "10.10.1.1"] },
  { id: "server", label: "Target Server", x: 64, y: 40, ports: ["22/ssh", "80/http", "443/https"] },
  { id: "attacker", label: "Attacker (You)", x: 82, y: 40, ports: ["Kali VM"] }
];

export default function NetworkMapWindow() {
  const { layout, trackAction, addEvidence, setProgress } = useWorkstation();
  const [selected, setSelected] = useState("server");
  const [trace, setTrace] = useState<string[]>([]);
  const [fwRule, setFwRule] = useState("ALLOW 443 FROM vpn");

  const device = DEVICES.find(item => item.id === selected) ?? DEVICES[3];

  function inspect() {
    addEvidence(`Network: inspected ${device.label}`);
    trackAction("network_inspect", device.id);
    setProgress(current => Math.min(90, current + 15));
  }

  function tracePacket() {
    const path = ["attacker", "internet", "firewall", "router", "server"];
    setTrace(path.map(id => DEVICES.find(device => device.id === id)?.label ?? id));
    trackAction("network_inspect", `trace:${layout.targetHost}`);
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <svg viewBox="0 0 100 50" className="h-28 w-full rounded border border-cyan-900/30 bg-black/40">
        {DEVICES.slice(0, -1).map((device, index) => {
          const next = DEVICES[index + 1];
          return (
            <line
              key={`line-${device.id}`}
              x1={device.x + 5}
              y1={device.y + 5}
              x2={next.x + 5}
              y2={next.y + 5}
              stroke="#14532d"
              strokeWidth="0.5"
            />
          );
        })}
        {DEVICES.map(device => (
          <g
            key={device.id}
            onClick={() => setSelected(device.id)}
            className="cursor-pointer"
          >
            <rect
              x={device.x}
              y={device.y}
              width="10"
              height="10"
              fill={selected === device.id ? "#166534" : "#052e16"}
              stroke={selected === device.id ? "#4ade80" : "#14532d"}
              strokeWidth="0.3"
            />
            <text x={device.x} y={device.y + 14} fill="#6b7280" fontSize="2.5">
              {device.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 flex-1 space-y-2">
        <p className="text-cyan-400">{device.label}</p>
        <p className="text-gray-600">Target: {layout.targetHost}</p>
        <ul className="text-gray-500">
          {device.ports.map(port => (
            <li key={port}>• {port}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button type="button" onClick={inspect} className="border border-cyan-700 px-2 py-1 text-cyan-400">
            Inspect
          </button>
          <button type="button" onClick={tracePacket} className="border border-cyan-700 px-2 py-1 text-cyan-400">
            Trace packet
          </button>
        </div>
        <label className="block text-gray-600">
          Firewall rule (simulated)
          <input
            value={fwRule}
            onChange={event => setFwRule(event.target.value)}
            className="mt-1 w-full border border-green-900/40 bg-black px-2 py-1 text-green-400 outline-none"
          />
        </label>
        {trace.length > 0 && (
          <p className="text-gray-500">Path: {trace.join(" → ")}</p>
        )}
      </div>
    </div>
  );
}
