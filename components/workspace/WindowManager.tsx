"use client";

import { useCallback, useState } from "react";

import WindowFrame from "@/components/workspace/WindowFrame";
import { createInitialWindows, type ManagedWindow } from "@/components/workspace/WorkstationContext";
import { useWorkstation } from "@/components/workspace/WorkstationContext";
import { WINDOW_LABELS, type WorkspaceWindowId } from "@/lib/workspaceConfig";

import BrowserWindow from "@/components/workspace/windows/BrowserWindow";
import BurpWindow from "@/components/workspace/windows/BurpWindow";
import FileExplorerWindow from "@/components/workspace/windows/FileExplorerWindow";
import InboxWindow from "@/components/workspace/windows/InboxWindow";
import MetasploitWindow from "@/components/workspace/windows/MetasploitWindow";
import NmapWindow from "@/components/workspace/windows/NmapWindow";
import SIEMWindow from "@/components/workspace/windows/SIEMWindow";
import SlackWindow from "@/components/workspace/windows/SlackWindow";
import TerminalWindow from "@/components/workspace/windows/TerminalWindow";
import TicketsWindow from "@/components/workspace/windows/TicketsWindow";
import WiresharkWindow from "@/components/workspace/windows/WiresharkWindow";
import NetworkMapWindow from "@/components/workspace/windows/NetworkMapWindow";

function renderWindow(id: WorkspaceWindowId) {
  switch (id) {
    case "terminal":   return <TerminalWindow />;
    case "browser":    return <BrowserWindow />;
    case "files":      return <FileExplorerWindow />;
    case "siem":       return <SIEMWindow />;
    case "wireshark":  return <WiresharkWindow />;
    case "burp":       return <BurpWindow />;
    case "metasploit": return <MetasploitWindow />;
    case "inbox":      return <InboxWindow />;
    case "slack":      return <SlackWindow />;
    case "tickets":    return <TicketsWindow />;
    case "nmap":       return <NmapWindow />;
    case "network":    return <NetworkMapWindow />;
    default:           return null;
  }
}

export default function WindowManager() {
  const { layout } = useWorkstation();
  const [windows, setWindows] = useState<ManagedWindow[]>(() =>
    createInitialWindows(layout.defaultWindows)
  );
  const [topZ, setTopZ] = useState(layout.defaultWindows.length);

  // Mobile active tool — defaults to first default window or terminal
  const [mobileActive, setMobileActive] = useState<WorkspaceWindowId>(
    () => layout.defaultWindows[0] ?? "terminal"
  );

  const focusWindow = useCallback((instanceId: string) => {
    setTopZ(current => {
      const next = current + 1;
      setWindows(ws =>
        ws.map(w => (w.instanceId === instanceId ? { ...w, zIndex: next, minimized: false } : w))
      );
      return next;
    });
  }, []);

  const moveWindow = useCallback((instanceId: string, x: number, y: number) => {
    setWindows(current =>
      current.map(w => (w.instanceId === instanceId ? { ...w, x, y } : w))
    );
  }, []);

  const minimizeWindow = useCallback((instanceId: string) => {
    setWindows(current =>
      current.map(w => (w.instanceId === instanceId ? { ...w, minimized: true } : w))
    );
  }, []);

  const closeWindow = useCallback((instanceId: string) => {
    setWindows(current => current.filter(w => w.instanceId !== instanceId));
  }, []);

  const launchWindow = useCallback((id: WorkspaceWindowId) => {
    setTopZ(current => {
      const next = current + 1;
      setWindows(ws => {
        const existing = ws.find(w => w.id === id);
        if (existing) {
          return ws.map(w => (w.id === id ? { ...w, minimized: false, zIndex: next } : w));
        }
        const size = createInitialWindows([id])[0];
        return [...ws, { ...size, instanceId: `${id}-${Date.now()}`, zIndex: next }];
      });
      return next;
    });
  }, []);

  const allToolIds = Object.keys(WINDOW_LABELS) as WorkspaceWindowId[];

  return (
    // absolute inset-0 fills the parent canvas regardless of content height.
    // Both mobile and desktop layers use the same bounding box.
    <div className="absolute inset-0">

      {/* ═══════════════════════════════════════════════════════════
          MOBILE VIEW  (hidden at lg breakpoint)
          Horizontal-scrollable tool tabs + full-height tool content.
          No dragging, no floating windows — touch-friendly.
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col lg:hidden">
        {/* Scrollable tool picker */}
        <div className="flex shrink-0 overflow-x-auto border-b border-green-900/30 bg-black/60">
          {allToolIds.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setMobileActive(id)}
              className={`shrink-0 border-r border-green-900/20 px-3 py-2 text-[10px] uppercase tracking-wide transition-colors ${
                mobileActive === id
                  ? "bg-green-950/70 text-green-300"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {WINDOW_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Full-height active tool */}
        <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-sm text-green-300">
          {renderWindow(mobileActive)}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP VIEW  (shown at lg breakpoint)
          Classic floating, draggable windows.
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 hidden flex-col lg:flex">
        {/* Tool launch buttons */}
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-green-900/30 bg-black/50 px-2 py-1.5">
          {allToolIds.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => launchWindow(id)}
              className="rounded border border-green-900/50 px-2 py-0.5 text-[10px] text-gray-500 hover:border-green-700 hover:text-green-400"
            >
              + {WINDOW_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Floating windows canvas */}
        <div className="relative flex-1 overflow-hidden p-2">
          {windows.map(w => (
            <WindowFrame
              key={w.instanceId}
              id={w.id}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              zIndex={w.zIndex}
              minimized={w.minimized}
              onMove={(x, y) => moveWindow(w.instanceId, x, y)}
              onFocus={() => focusWindow(w.instanceId)}
              onMinimize={() => minimizeWindow(w.instanceId)}
              onClose={() => closeWindow(w.instanceId)}
            >
              {renderWindow(w.id)}
            </WindowFrame>
          ))}
        </div>
      </div>

    </div>
  );
}
