"use client";

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
    mission,
    completeLab,
    submitting,
    analystAnswer,
    setAnalystAnswer,
    submitAnalystAnswer
  } = useWorkstation();

  const isSoc = layout.module === "soc";

  return (
    <aside className="flex w-52 shrink-0 flex-col border-l border-green-900/50 bg-black/40 sm:w-56">
      <section className="border-b border-green-900/40 p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Notes</p>
        <textarea
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Analyst notes..."
          className="mt-2 h-24 w-full resize-none border border-green-900/40 bg-black/60 p-2 text-xs text-green-300 outline-none"
        />
      </section>

      <section className="border-b border-green-900/40 p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Evidence</p>
        <ul className="mt-2 max-h-28 space-y-1 overflow-auto text-xs">
          {evidence.length === 0 && <li className="text-gray-700">Collect artifacts from tools...</li>}
          {evidence.map(item => (
            <li key={item} className="rounded bg-green-950/20 px-2 py-1 text-green-400">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-1 flex-col p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">Progress</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-green-950/30">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${completed ? 100 : progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-600">{completed ? "Mission complete" : `${progress}% investigated`}</p>

        {isSoc && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">Analyst response</p>
            <input
              value={analystAnswer}
              onChange={event => setAnalystAnswer(event.target.value)}
              disabled={completed || submitting}
              placeholder="Finding / IOC"
              className="w-full border border-green-800 bg-black px-2 py-1.5 text-xs outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={submitAnalystAnswer}
              disabled={completed || submitting || !analystAnswer.trim()}
              className="w-full border border-green-600 py-1.5 text-xs text-green-400 hover:bg-green-950 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : completed ? "Complete" : "Submit analysis"}
            </button>
          </div>
        )}

        {layout.module === "career" && !completed && (
          <button
            type="button"
            onClick={() => completeLab(analystAnswer.trim() || "shift-report")}
            disabled={submitting || progress < 30 || !analystAnswer.trim()}
            className="mt-4 w-full border border-blue-600 py-2 text-xs text-blue-300 hover:bg-blue-950 disabled:opacity-50"
          >
            End shift / Submit report
          </button>
        )}

        {result && (
          <p
            className={`mt-3 text-xs ${result.includes("GRANTED") ? "text-green-400" : "text-red-400"}`}
          >
            {result}
          </p>
        )}
      </section>
    </aside>
  );
}
