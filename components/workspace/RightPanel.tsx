"use client";

import { useEffect, useRef } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

export default function RightPanel() {
  const {
    notes,
    setNotes,
    evidence,
    progress,
    result,
    completed,
    layout,
    submitting,
    analystAnswer,
    setAnalystAnswer,
    submitAnalystAnswer
  } = useWorkstation();

  const resultRef = useRef<HTMLDivElement>(null);
  const previousResultRef = useRef("");

  const isCareer = layout.module === "career";
  const careerProgressOk = !isCareer || progress >= 30;

  useEffect(() => {
    if (!result || result === previousResultRef.current) return;

    previousResultRef.current = result;

    const frame = window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      resultRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [result]);

  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden bg-black/40">
      <section className="shrink-0 border-b border-green-900/40 p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Notes</p>
        <textarea
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Analyst notes..."
          className="mt-2 h-24 w-full min-w-0 max-w-full resize-none border border-green-900/40 bg-black/60 p-2 text-xs text-green-300 outline-none"
        />
      </section>

      <section className="shrink-0 border-b border-green-900/40 p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Evidence</p>
        <ul className="mt-2 max-h-28 min-w-0 space-y-1 overflow-auto text-xs">
          {evidence.length === 0 && <li className="text-gray-700">Collect artifacts from tools...</li>}
          {evidence.map(item => (
            <li
              key={item}
              className="break-words rounded bg-green-950/20 px-2 py-1 text-green-400 [overflow-wrap:anywhere]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-auto p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Progress</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-green-950/30">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${completed ? 100 : progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-600">{completed ? "Mission complete" : `${progress}% investigated`}</p>

        {!completed && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              {isCareer ? "Shift report" : "Submit finding"}
            </p>
            <input
              value={analystAnswer}
              onChange={event => setAnalystAnswer(event.target.value)}
              disabled={submitting}
              placeholder={isCareer ? "End-of-shift summary / IOC" : "Finding / IOC / answer"}
              className="w-full min-w-0 max-w-full border border-green-800 bg-black px-2 py-1.5 text-xs outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={submitAnalystAnswer}
              disabled={submitting || !analystAnswer.trim() || !careerProgressOk}
              className="w-full border border-green-600 py-1.5 text-xs text-green-400 hover:bg-green-950 disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : isCareer
                  ? "End shift / Submit report"
                  : "Submit analysis"}
            </button>
            {isCareer && progress < 30 && (
              <p className="text-[10px] text-amber-600">
                Investigate at least 30% before submitting your shift report.
              </p>
            )}
          </div>
        )}

        {result && (
          <div
            ref={resultRef}
            tabIndex={-1}
            aria-live="polite"
            className={`mt-3 max-h-24 overflow-y-auto whitespace-pre-wrap break-words rounded border px-2 py-2 text-xs outline-none [overflow-wrap:anywhere] ${
              result.includes("GRANTED")
                ? "border-green-800/60 bg-green-950/20 text-green-400"
                : "border-red-800/60 bg-red-950/20 text-red-400"
            }`}
          >
            {result}
          </div>
        )}
      </section>
    </aside>
  );
}
