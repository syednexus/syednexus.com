"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

const CHANNEL_MESSAGES = [
  { user: "tier1-analyst", text: "Seeing auth anomalies on jsmith — anyone else?", time: "09:12" },
  { user: "ir-lead", text: "Check impossible travel playbook. Escalate if confirmed.", time: "09:14" },
  { user: "you", text: "", time: "09:15" }
];

export default function SlackWindow() {
  const { completed, submitting, addEvidence, trackAction, setProgress } = useWorkstation();
  const [messages, setMessages] = useState(CHANNEL_MESSAGES);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMessages(current => [...current, { user: "you", text: draft, time: "09:16" }]);
    addEvidence(`Slack: ${draft}`);
    trackAction("evidence", `slack:${draft.trim()}`);
    setProgress(current => Math.min(85, current + 15));
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col text-xs">
      <p className="mb-2 text-purple-400">#soc-incidents</p>
      <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
        {messages.map((message, index) => (
          <li key={`${message.user}-${index}`}>
            <span className="text-gray-600">{message.time}</span>{" "}
            <span className="text-cyan-500">{message.user}</span>
            <p className="text-gray-300">{message.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2 border-t border-purple-900/30 pt-2">
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          disabled={completed || submitting}
          placeholder="Message #soc-incidents"
          className="min-w-0 flex-1 border border-purple-900/40 bg-black px-2 py-1 outline-none"
        />
        <button type="button" onClick={send} className="border border-purple-600 px-2 text-purple-300">
          Send
        </button>
      </div>
    </div>
  );
}
