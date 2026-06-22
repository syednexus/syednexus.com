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
    case "terminal":
      return <TerminalWindow />;
    case "browser":
      return <BrowserWindow />;
    case "files":
      return <FileExplorerWindow />;
    case "siem":
      return <SIEMWindow />;
    case "wireshark":
      return <WiresharkWindow />;
    case "burp":
      return <BurpWindow />;
    case "metasploit":
      return <MetasploitWindow />;
    case "inbox":
      return <InboxWindow />;
    case "slack":
      return <SlackWindow />;
    case "tickets":
      return <TicketsWindow />;
    case "nmap":
      return <NmapWindow />;
    case "network":
      return <NetworkMapWindow />;
    default:
      return null;
  }
}

export default function WindowManager() {
  const { layout } = useWorkstation();
  const [windows, setWindows] = useState<ManagedWindow[]>(() => createInitialWindows(layout.defaultWindows));
  const [topZ, setTopZ] = useState(layout.defaultWindows.length);

  const focusWindow = useCallback((instanceId: string) => {
    setTopZ(current => {
      const next = current + 1;
      setWindows(windows =>
        windows.map(window =>
          window.instanceId === instanceId ? { ...window, zIndex: next, minimized: false } : window
        )
      );
      return next;
    });
  }, []);

  const moveWindow = useCallback((instanceId: string, x: number, y: number) => {
    setWindows(current =>
      current.map(window => (window.instanceId === instanceId ? { ...window, x, y } : window))
    );
  }, []);

  const minimizeWindow = useCallback((instanceId: string) => {
    setWindows(current =>
      current.map(window => (window.instanceId === instanceId ? { ...window, minimized: true } : window))
    );
  }, []);

  const closeWindow = useCallback((instanceId: string) => {
    setWindows(current => current.filter(window => window.instanceId !== instanceId));
  }, []);

  const launchWindow = useCallback((id: WorkspaceWindowId) => {
    setTopZ(current => {
      const next = current + 1;
      setWindows(windows => {
        const existing = windows.find(window => window.id === id);
        if (existing) {
          return windows.map(window =>
            window.id === id ? { ...window, minimized: false, zIndex: next } : window
          );
        }
        const size = createInitialWindows([id])[0];
        return [...windows, { ...size, instanceId: `${id}-${Date.now()}`, zIndex: next }];
      });
      return next;
    });
  }, []);

  const allToolIds = Object.keys(WINDOW_LABELS) as WorkspaceWindowId[];

  return (
    <div className="relative h-full">
      <div className="absolute left-0 right-0 top-0 z-10 flex flex-wrap gap-1 border-b border-green-900/30 bg-black/50 px-2 py-1.5">
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

      <div className="absolute inset-0 top-9 overflow-hidden p-2">
        {windows.map(window => (
          <WindowFrame
            key={window.instanceId}
            id={window.id}
            x={window.x}
            y={window.y}
            width={window.width}
            height={window.height}
            zIndex={window.zIndex}
            minimized={window.minimized}
            onMove={(x, y) => moveWindow(window.instanceId, x, y)}
            onFocus={() => focusWindow(window.instanceId)}
            onMinimize={() => minimizeWindow(window.instanceId)}
            onClose={() => closeWindow(window.instanceId)}
          >
            {renderWindow(window.id)}
          </WindowFrame>
        ))}
      </div>
    </div>
  );
}
