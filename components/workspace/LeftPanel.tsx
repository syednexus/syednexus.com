"use client";

import { useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";

type Tab = "tasks" | "hints" | "files";

export default function LeftPanel() {
  const { mission, layout, tasks, completedTaskIds, selectedFile, setSelectedFile, completed } = useWorkstation();
  const [tab, setTab] = useState<Tab>("tasks");
  const [revealedHints, setRevealedHints] = useState(0);
  const hints = tasks.map(task => task.hint).filter((hint): hint is string => Boolean(hint));

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-green-900/50 bg-black/40 sm:w-60">
      <div className="flex border-b border-green-900/40 text-[10px] uppercase tracking-wider">
        {(["tasks", "hints", "files"] as Tab[]).map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`flex-1 px-2 py-2 ${
              tab === item ? "bg-green-950/50 text-green-300" : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 text-xs">
        {tab === "tasks" && (
          <ol className="space-y-2">
            {tasks.map(task => {
              const done = completedTaskIds.includes(task.id);
              return (
                <li
                  key={task.id}
                  className={`rounded border p-2 ${
                    done ? "border-green-700/50 bg-green-950/30 text-green-400" : "border-green-900/30 text-gray-500"
                  }`}
                >
                  <span>{done ? "✔" : "○"}</span> Task {task.id}: {task.objective}
                </li>
              );
            })}
            {tasks.length === 0 &&
              layout.objectives.map((objective, index) => (
                <li key={`obj-${index}`} className="rounded border border-green-900/30 p-2 text-gray-500">
                  {objective}
                </li>
              ))}
          </ol>
        )}

        {tab === "hints" && (
          <div className="space-y-2">
            {!completed && revealedHints < hints.length && (
              <button
                type="button"
                onClick={() => setRevealedHints(current => current + 1)}
                className="w-full border border-yellow-800 px-2 py-1 text-yellow-500 hover:bg-yellow-950/20"
              >
                Reveal hint {revealedHints + 1}/{hints.length}
              </button>
            )}
            {hints.slice(0, revealedHints).map((hint, index) => (
              <p key={`hint-${index}`} className="rounded border border-yellow-900/40 bg-yellow-950/10 p-2 text-yellow-200/80">
                {hint}
              </p>
            ))}
            {hints.length === 0 && <p className="text-gray-600">Use Nexus Mentor for guidance.</p>}
          </div>
        )}

        {tab === "files" && (
          <ul className="space-y-1">
            {layout.files.map(file => (
              <li key={file.name}>
                <button
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full rounded px-2 py-1.5 text-left ${
                    selectedFile?.name === file.name ? "bg-green-950/40 text-green-300" : "text-gray-500"
                  }`}
                >
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
