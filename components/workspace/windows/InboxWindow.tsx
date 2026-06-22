"use client";

import { useEffect, useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

const LOGIN_EVENT = {
  time: "09:00",
  from: "Nexus SOC Portal",
  subject: "Shift login successful",
  body: "Welcome back, analyst. Manager assigned case INC-4412 — review SIEM alerts and ticket queue.",
  priority: "medium" as const
};

const SHIFT_EVENTS = [
  { time: "09:05", from: "SOC Lead", subject: "Queue spike overnight", body: "12 alerts waiting — prioritize high severity first.", priority: "high" },
  { time: "09:22", from: "Manager", subject: "Standup in 10 min", body: "Be ready to summarize top incident.", priority: "medium" },
  { time: "10:15", from: "IR Team", subject: "Playbook update", body: "Impossible travel runbook v2.1 published.", priority: "low" }
];

export default function InboxWindow() {
  const { addEvidence, setProgress, layout } = useWorkstation();
  const [clock, setClock] = useState("09:00");
  const [events, setEvents] = useState<typeof SHIFT_EVENTS>(
    layout.module === "career" ? [LOGIN_EVENT] : SHIFT_EVENTS.slice(0, 2)
  );
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (layout.module !== "career") return;

    let index = 0;
    const timer = window.setInterval(() => {
      if (index < SHIFT_EVENTS.length) {
        setEvents(current => [...current, SHIFT_EVENTS[index]]);
        index += 1;
        setClock(SHIFT_EVENTS[index - 1]?.time ?? "09:00");
      }
    }, 8000);

    return () => window.clearInterval(timer);
  }, [layout.module]);

  const messages = events;

  return (
    <div className="flex h-full flex-col text-xs">
      {layout.module === "career" && (
        <p className="mb-2 text-blue-400">Shift clock: {clock}</p>
      )}
      <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
        {messages.map((message, index) => (
          <li key={`${message.subject}-${index}`} className="rounded border border-blue-900/30 bg-blue-950/10">
            <button
              type="button"
              onClick={() => {
                setOpen(open === index ? null : index);
                addEvidence(`Email: ${message.subject}`);
                setProgress(current => Math.min(70, current + 10));
              }}
              className="w-full px-3 py-2 text-left"
            >
              <span className="text-gray-600">{message.time}</span>{" "}
              <span className={message.priority === "high" ? "font-bold text-red-400" : "text-blue-300"}>
                {message.from}
              </span>
              <p className="text-white">{message.subject}</p>
            </button>
            {open === index && <p className="border-t border-blue-900/20 px-3 py-2 text-gray-500">{message.body}</p>}
          </li>
        ))}
        {layout.module === "career" && messages.length <= 1 && (
          <p className="text-gray-600">More shift events arriving shortly…</p>
        )}
      </ul>
    </div>
  );
}
