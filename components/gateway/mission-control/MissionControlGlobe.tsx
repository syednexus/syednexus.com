"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import MissionControlGlobeFallback from "./MissionControlGlobeFallback";
import type { CameraMode, GlobeHotspot } from "./types";

const Globe3D = dynamic(() => import("./MissionControlGlobe3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-slate-500">
      Initializing globe…
    </div>
  )
});

type Props = {
  activeId: string | null;
  focusId: string | null;
  globalViewToken: number;
  resumeAutoRotateToken: number;
  onSelect: (hotspot: GlobeHotspot) => void;
  onHover?: (id: string | null) => void;
  onFocusComplete?: () => void;
  onBackgroundClick?: () => void;
  onCameraModeChange?: (mode: CameraMode) => void;
};

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function MissionControlGlobe(props: Props) {
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUse3d(!reduced && detectWebGL());
  }, []);

  if (!use3d) {
    return (
      <MissionControlGlobeFallback
        activeId={props.activeId}
        focusId={props.focusId}
        onSelect={props.onSelect}
        onHover={props.onHover}
        onBackgroundClick={props.onBackgroundClick}
      />
    );
  }

  return <Globe3D {...props} />;
}
