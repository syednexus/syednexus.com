"use client";

import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";

import { WINDOW_LABELS, type WorkspaceWindowId } from "@/lib/workspaceConfig";

type WindowFrameProps = {
  id: WorkspaceWindowId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  onMove: (x: number, y: number) => void;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
};

export default function WindowFrame({
  id,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  onMove,
  onFocus,
  onMinimize,
  onClose,
  children
}: WindowFrameProps) {
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const onTitleMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      onFocus();
      dragRef.current = { startX: event.clientX, startY: event.clientY, originX: x, originY: y };

      const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
        if (!dragRef.current) return;
        const dx = moveEvent.clientX - dragRef.current.startX;
        const dy = moveEvent.clientY - dragRef.current.startY;
        onMove(
          Math.max(0, dragRef.current.originX + dx),
          Math.max(0, dragRef.current.originY + dy)
        );
      };

      const onMouseUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [onFocus, onMove, x, y]
  );

  if (minimized) {
    return (
      <button
        type="button"
        onClick={onFocus}
        className="absolute bottom-2 rounded border border-green-800 bg-black/90 px-3 py-1 text-xs text-green-400"
        style={{ left: 8 + zIndex * 110, zIndex }}
      >
        {WINDOW_LABELS[id]}
      </button>
    );
  }

  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-lg border border-green-800/80 bg-[#0a0f0a] shadow-2xl shadow-black/60"
      style={{ left: x, top: y, width, height, zIndex }}
      onMouseDown={onFocus}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b border-green-900/60 bg-green-950/40 px-3 py-2 active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <span className="text-xs font-medium text-green-300">{WINDOW_LABELS[id]}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onMinimize();
            }}
            className="rounded px-2 py-0.5 text-xs text-yellow-400 hover:bg-yellow-950/40"
          >
            _
          </button>
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onClose();
            }}
            className="rounded px-2 py-0.5 text-xs text-red-400 hover:bg-red-950/40"
          >
            ×
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-sm text-green-300">{children}</div>
    </div>
  );
}
