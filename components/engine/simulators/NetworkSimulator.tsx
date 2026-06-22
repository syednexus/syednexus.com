"use client";

import { useState } from "react";

export default function NetworkSimulator() {
  const [report, setReport] = useState("");

  function scan() {
    setReport(`
NETWORK SCAN REPORT
===================

Target:
10.0.4.22

Open Ports:
22/tcp   SSH
443/tcp  HTTPS
8080/tcp HTTP-ALT

Finding:
❌ Unauthorized service exposed on 8080/tcp

Traffic:
Outbound beacon to 185.234.88.19:4444

MITRE:
T1046 Network Service Discovery
T1071 Application Layer Protocol

VERDICT:
LATERAL MOVEMENT SUSPECTED
`);
  }

  return (
    <div className="rounded-xl border border-cyan-800 bg-black p-6 text-green-400">
      <p className="text-cyan-400">NETWORK RANGE // PACKET TRACE</p>

      <button
        type="button"
        onClick={scan}
        className="mt-4 border border-cyan-700 px-4 py-2 transition hover:bg-cyan-950"
      >
        RUN NMAP TRACE
      </button>

      {report && (
        <pre className="mt-5 whitespace-pre-wrap text-sm text-gray-300">{report}</pre>
      )}
    </div>
  );
}
