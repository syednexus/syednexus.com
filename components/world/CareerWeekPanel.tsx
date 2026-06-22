"use client";

import { useEffect } from "react";

import { useWorld, weekdayLabel } from "@/context/WorldContext";
import { isFriday } from "@/lib/world/careerWeek";

export default function CareerWeekPanel() {
  const {
    careerWeek,
    reputation,
    resolveCareerEventById,
    advanceCareerDay,
    finalizeCareerWeek,
    credits,
    initCareerWeekIfNeeded
  } = useWorld();

  useEffect(() => {
    initCareerWeekIfNeeded();
  }, [initCareerWeekIfNeeded]);

  if (!careerWeek) {
    return (
      <p className="text-sm text-gray-500">
        Loading work week schedule…
      </p>
    );
  }

  const resolved = careerWeek.events.filter(event => event.resolved).length;
  const total = careerWeek.events.length;

  return (
    <section className="mt-8 rounded-xl border border-blue-900/50 bg-blue-950/10 p-6 font-mono">
      <p className="text-xs uppercase tracking-widest text-blue-400">Real Work Week</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-200">
        {weekdayLabel(careerWeek.dayIndex)} — Week {careerWeek.weekId}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Reputation {reputation} shapes incident volume. Performance: {resolved}/{total} ({careerWeek.performanceScore}%)
      </p>

      <ul className="mt-6 space-y-3">
        {careerWeek.events.map(event => (
          <li
            key={event.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-blue-900/30 px-4 py-3 text-sm"
          >
            <div>
              <span className="text-blue-500">[{event.type}]</span> {event.title}
              <p className="mt-1 text-xs text-gray-600">{event.body}</p>
            </div>
            {!event.resolved ? (
              <button
                type="button"
                onClick={() => resolveCareerEventById(event.id)}
                className="border border-blue-600 px-3 py-1 text-xs text-blue-300"
              >
                Resolve
              </button>
            ) : (
              <span className="text-xs text-green-500">Done</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        {careerWeek.dayIndex < 4 && (
          <button
            type="button"
            onClick={advanceCareerDay}
            className="border border-blue-500 px-4 py-2 text-sm text-blue-300"
          >
            Next day →
          </button>
        )}
        {isFriday(careerWeek) && !careerWeek.managerReview && (
          <button
            type="button"
            onClick={finalizeCareerWeek}
            className="border border-green-500 px-4 py-2 text-sm text-green-400"
          >
            End week — Manager review
          </button>
        )}
      </div>

      {careerWeek.managerReview && (
        <div className="mt-6 rounded border border-green-800 bg-green-950/20 p-4 text-sm text-green-200">
          <p className="text-xs uppercase text-green-500">Manager review</p>
          <p className="mt-2">{careerWeek.managerReview}</p>
          <p className="mt-2 text-xs text-amber-400">+12 CR awarded · Balance {credits} CR</p>
        </div>
      )}
    </section>
  );
}
