"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

type Tab = "proxy" | "repeater" | "intruder";

export default function BurpWindow() {
  const { layout, completed, submitting, addEvidence, trackAction, setProgress } =
    useWorkstation();
  const [tab, setTab] = useState<Tab>("proxy");
  const [intercepted, setIntercepted] = useState(true);
  const [requestBody, setRequestBody] = useState(
    `POST /login HTTP/1.1\nHost: ${layout.targetHost}\nContent-Type: application/x-www-form-urlencoded\n\nusername=test&password=test`
  );
  const [response, setResponse] = useState("Waiting for intercept...");
  const [intruderPayload, setIntruderPayload] = useState("admin' OR '1'='1");

  function forward() {
    trackAction("burp_intercept", requestBody);
    addEvidence("Burp: forwarded modified request");
    setProgress(current => Math.min(92, current + 22));
    setResponse("HTTP/1.1 200 OK\nSet-Cookie: session=admin; role=administrator");
  }

  function sendRepeater() {
    trackAction("burp_repeater", requestBody);
    setResponse("HTTP/1.1 200 OK\nX-Lab-Flag: injection_confirmed (simulated)");
    addEvidence("Burp Repeater: request sent");
  }

  function runIntruder() {
    trackAction("burp_intercept", intruderPayload);
    setResponse(`Intruder: tested payload → ${intruderPayload}\nResponse: 200 OK (auth bypass simulated)`);
    addEvidence(`Burp Intruder: ${intruderPayload.slice(0, 40)}`);
  }

  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <div className="flex gap-1 border-b border-orange-900/30 pb-1">
        {(["proxy", "repeater", "intruder"] as Tab[]).map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`px-2 py-1 capitalize ${tab === item ? "text-orange-300" : "text-gray-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "proxy" && (
        <>
          <label className="flex items-center gap-2 text-gray-500">
            <input type="checkbox" checked={intercepted} onChange={event => setIntercepted(event.target.checked)} />
            Intercept on
          </label>
          <textarea
            value={requestBody}
            onChange={event => setRequestBody(event.target.value)}
            disabled={completed || submitting}
            className="h-28 w-full resize-none border border-orange-900/40 bg-black/60 p-2 text-orange-200/90 outline-none"
          />
          <div className="flex gap-2">
            <button type="button" onClick={forward} className="border border-orange-600 px-3 py-1 text-orange-300">
              Forward
            </button>
          </div>
        </>
      )}

      {tab === "repeater" && (
        <>
          <textarea
            value={requestBody}
            onChange={event => setRequestBody(event.target.value)}
            className="h-28 w-full resize-none border border-orange-900/40 bg-black/60 p-2 outline-none"
          />
          <button type="button" onClick={sendRepeater} className="border border-orange-600 px-3 py-1 text-orange-300">
            Send
          </button>
        </>
      )}

      {tab === "intruder" && (
        <>
          <input
            value={intruderPayload}
            onChange={event => setIntruderPayload(event.target.value)}
            className="w-full border border-orange-900/40 bg-black px-2 py-1 outline-none"
          />
          <button type="button" onClick={runIntruder} className="border border-orange-600 px-3 py-1 text-orange-300">
            Start attack (simulated)
          </button>
        </>
      )}

      <pre className="max-h-24 overflow-auto whitespace-pre-wrap rounded border border-green-900/30 bg-black/40 p-2 text-green-400">
        {response}
      </pre>
    </div>
  );
}
