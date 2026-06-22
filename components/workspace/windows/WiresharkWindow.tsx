"use client";

import { useMemo, useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { parseGameConfig } from "@/lib/gameTypes";

type Packet = {
  id: number;
  time: string;
  src: string;
  dst: string;
  proto: string;
  info: string;
  layers: Record<string, string>;
  credential?: string;
};

const DEFAULT_PACKETS: Packet[] = [
  {
    id: 1,
    time: "0.000",
    src: "10.0.1.5",
    dst: "10.10.1.50",
    proto: "HTTP",
    info: "GET /login HTTP/1.1",
    layers: {
      ethernet: "08:00:27:aa:bb:cc → 52:54:00:12:34:56",
      ip: "10.0.1.5 → 10.10.1.50",
      tcp: "80 → 443",
      http: "GET /login"
    }
  },
  {
    id: 2,
    time: "0.102",
    src: "10.0.1.5",
    dst: "10.10.1.50",
    proto: "HTTP",
    info: "POST /login user=admin' OR 1=1--",
    layers: {
      ethernet: "08:00:27:aa:bb:cc → 52:54:00:12:34:56",
      ip: "10.0.1.5 → 10.10.1.50",
      tcp: "POST /login",
      http: "username=admin' OR 1=1--&password=x"
    },
    credential: "admin"
  },
  {
    id: 3,
    time: "0.115",
    src: "10.10.1.50",
    dst: "10.0.1.5",
    proto: "DNS",
    info: "Query x7k9.malware-c2.lab",
    layers: {
      ethernet: "52:54:00:12:34:56 → 08:00:27:aa:bb:cc",
      ip: "10.10.1.50 → 10.0.1.5",
      dns: "A? x7k9.malware-c2.lab"
    }
  }
];

export default function WiresharkWindow() {
  const { mission, completed, submitting, addEvidence, trackAction, setProgress } = useWorkstation();
  useMemo(() => parseGameConfig(mission), [mission]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [stream, setStream] = useState("");

  const packets = DEFAULT_PACKETS;

  const filtered = packets.filter(packet => {
    if (!filter.trim()) return true;
    const f = filter.toLowerCase();
    if (f === "http") return packet.proto === "HTTP";
    if (f === "dns") return packet.proto === "DNS";
    if (f.startsWith("ip.addr")) return packet.src.includes("10.0") || packet.dst.includes("10.0");
    return packet.info.toLowerCase().includes(f);
  });

  function inspectPacket(packet: Packet) {
    setSelected(packet.id);
    trackAction("packet_inspect", packet.info);
    addEvidence(`Packet #${packet.id}: ${packet.proto}`);
    setProgress(current => Math.min(88, current + 18));
  }

  function applyFilter() {
    trackAction("packet_filter", filter);
  }

  function followStream() {
    const packet = packets.find(item => item.id === selected);
    if (!packet) return;
    const body = packet.layers.http ?? packet.info;
    setStream(
      `TCP Stream Follow (simulated):\n${body}\n${packet.credential ? `\nCredential discovered: ${packet.credential}` : ""}`
    );
    trackAction("tcp_stream", String(packet.id));
    addEvidence(`TCP stream #${packet.id}`);
  }

  const detail = packets.find(packet => packet.id === selected);

  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <div className="flex gap-2">
        <input
          value={filter}
          onChange={event => setFilter(event.target.value)}
          placeholder="Filter: http, dns, ip.addr=="
          disabled={completed || submitting}
          className="min-w-0 flex-1 border border-green-900/40 bg-black px-2 py-1 outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={applyFilter}
          disabled={completed || submitting}
          className="border border-green-700 px-2 text-green-400"
        >
          Apply
        </button>
      </div>

      <div className="overflow-auto rounded border border-green-900/30">
        <table className="w-full text-left text-[10px]">
          <thead className="sticky top-0 bg-black/80 text-gray-600">
            <tr>
              <th className="px-1 py-1">No.</th>
              <th className="px-1 py-1">Time</th>
              <th className="px-1 py-1">Source</th>
              <th className="px-1 py-1">Destination</th>
              <th className="px-1 py-1">Protocol</th>
              <th className="px-1 py-1">Info</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(packet => (
              <tr
                key={packet.id}
                className={`cursor-pointer hover:bg-green-950/30 ${selected === packet.id ? "bg-green-950/50" : ""}`}
                onClick={() => !completed && !submitting && inspectPacket(packet)}
              >
                <td className="px-1 py-0.5 text-green-500">{packet.id}</td>
                <td className="px-1 py-0.5 text-gray-500">{packet.time}</td>
                <td className="px-1 py-0.5 text-cyan-600">{packet.src}</td>
                <td className="px-1 py-0.5 text-cyan-600">{packet.dst}</td>
                <td className="px-1 py-0.5 text-purple-400">{packet.proto}</td>
                <td className="max-w-[140px] truncate px-1 py-0.5 text-gray-400">{packet.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="rounded border border-green-900/30 bg-black/40 p-2 text-[10px] text-gray-500">
          <p className="text-cyan-500">Packet #{detail.id} — Protocol stack</p>
          {Object.entries(detail.layers).map(([layer, value]) => (
            <p key={layer}>
              <span className="text-gray-600">{layer}:</span> {value}
            </p>
          ))}
          <button
            type="button"
            onClick={followStream}
            disabled={completed || submitting}
            className="mt-2 border border-cyan-800 px-2 py-0.5 text-cyan-400 disabled:opacity-50"
          >
            Follow TCP stream
          </button>
        </div>
      )}

      {stream && (
        <pre className="max-h-20 overflow-auto whitespace-pre-wrap rounded border border-yellow-900/30 bg-yellow-950/10 p-2 text-yellow-600/90">
          {stream}
        </pre>
      )}
    </div>
  );
}
