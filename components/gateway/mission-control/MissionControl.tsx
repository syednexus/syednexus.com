"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import { clearGlobeState, loadGlobeState, saveGlobeState } from "@/lib/globeState";

import MissionControlSidebar from "./MissionControlSidebar";
import MissionControlOperatorPanel from "./MissionControlOperatorPanel";
import MissionControlAnalytics from "./MissionControlAnalytics";
import MissionControlFeed from "./MissionControlFeed";
import MissionControlTimeline from "./MissionControlTimeline";
import MissionControlGlobe from "./MissionControlGlobe";
import HotspotDockPanel from "./HotspotDockPanel";
import { GLOBE_HOTSPOTS } from "./hotspots";
import { useMissionControlData } from "./useMissionControlData";
import type { CameraMode, GlobeHotspot } from "./types";

export default function MissionControl() {
  const { playSound } = useSound();
  const { profile, stats, timeline, focusAreas, feed } = useMissionControlData();

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [dockHotspot, setDockHotspot] = useState<GlobeHotspot | null>(null);
  const [showHero, setShowHero] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [globalViewToken, setGlobalViewToken] = useState(0);
  const [resumeAutoRotateToken, setResumeAutoRotateToken] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraMode>("AUTO_ROTATE");
  const booted = useRef(false);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = loadGlobeState();
    if (!saved?.focusId) return;
    const hotspot = GLOBE_HOTSPOTS.find(h => h.id === saved.focusId);
    if (!hotspot) return;
    setActiveHotspot(saved.activeHotspot ?? saved.focusId);
    setFocusId(saved.focusId);
    if (saved.dockOpen) setDockHotspot(hotspot);
    setShowHero(false);
  }, []);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    playSound("ui.panel.open");
  }, [playSound]);

  const closePanel = useCallback(() => {
    playSound("ui.panel.close");
    setDockHotspot(null);
    setResumeAutoRotateToken(t => t + 1);
    saveGlobeState({
      focusId,
      activeHotspot,
      dockOpen: false
    });
  }, [playSound, focusId, activeHotspot]);

  const resetGlobalView = useCallback(() => {
    playSound("ui.panel.close");
    setDockHotspot(null);
    setActiveHotspot(null);
    setFocusId(null);
    setShowHero(true);
    setGlobalViewToken(token => token + 1);
    setCameraMode("AUTO_ROTATE");
    clearGlobeState();
  }, [playSound]);

  const focusIdRef = useRef(focusId);
  focusIdRef.current = focusId;

  const handleFocusComplete = useCallback(() => {
    setShowHero(false);
    const id = focusIdRef.current;
    const hotspot = GLOBE_HOTSPOTS.find(h => h.id === id);
    if (hotspot) {
      setDockHotspot(hotspot);
      saveGlobeState({
        focusId: id,
        activeHotspot: hotspot.id,
        dockOpen: true
      });
      playSound("ui.panel.open");
    }
  }, [playSound]);

  const handleHotspotSelect = useCallback(
    (hotspot: GlobeHotspot) => {
      playSound("evidence.collect");
      setDockHotspot(null);
      setActiveHotspot(hotspot.id);
      setFocusId(hotspot.id);
    },
    [playSound]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dockHotspot) {
        closePanel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dockHotspot, closePanel]);

  const panelOpen = dockHotspot !== null;

  return (
    <div className="relative -mx-0 flex min-h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,#0c4a6e22,#020617_55%)] text-white">
      <div className="flex items-center justify-between border-b border-cyan-500/10 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNav(v => !v)}
          className="rounded-lg border border-cyan-500/25 px-3 py-1.5 text-[10px] tracking-widest text-cyan-200"
        >
          MODULES
        </button>
        <p className="text-xs font-semibold tracking-widest text-cyan-400">Mission Control</p>
        <button
          type="button"
          onClick={resetGlobalView}
          className="rounded-lg border border-cyan-500/25 px-3 py-1.5 text-[10px] tracking-widest text-cyan-200"
        >
          GLOBAL
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className={`${
            mobileNav ? "absolute inset-y-0 left-0 z-40 w-64 shadow-2xl lg:relative lg:block" : "hidden"
          } lg:block lg:w-52 xl:w-56`}
        >
          <MissionControlSidebar />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div
              className={`relative flex min-h-[300px] flex-col transition-[width] duration-500 ease-out lg:min-h-0 ${
                panelOpen ? "lg:w-[58%] xl:w-[62%]" : "w-full"
              }`}
            >
              <motion.div
                animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : -12 }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-500/90">
                  Syed Nexus · Cyber Operations Command
                </p>
                <h1 className="mt-2 text-xl font-bold tracking-wide sm:text-2xl">Mission Control</h1>
              </motion.div>

              <div className="relative min-h-[280px] flex-1">
                <MissionControlGlobe
                  activeId={activeHotspot}
                  focusId={focusId}
                  globalViewToken={globalViewToken}
                  resumeAutoRotateToken={resumeAutoRotateToken}
                  onSelect={handleHotspotSelect}
                  onFocusComplete={handleFocusComplete}
                  onBackgroundClick={panelOpen ? closePanel : undefined}
                  onCameraModeChange={setCameraMode}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2">
                <button
                  type="button"
                  onClick={resetGlobalView}
                  className={`rounded-full border px-3 py-1 text-[10px] tracking-widest transition ${
                    focusId
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  ← Global View
                </button>
                {cameraMode !== "AUTO_ROTATE" && !panelOpen && (
                  <span className="text-[9px] uppercase tracking-widest text-slate-600">
                    {cameraMode === "FREE_ORBIT" ? "Exploring" : "Focused"}
                  </span>
                )}
              </div>
            </div>

            <AnimatePresence>
              {dockHotspot && (
                <div className="h-72 shrink-0 lg:h-auto lg:w-[42%] xl:w-[38%]">
                  <HotspotDockPanel
                    hotspot={dockHotspot}
                    profile={profile}
                    timeline={timeline}
                    focusId={focusId}
                    onClose={closePanel}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          <MissionControlTimeline events={timeline} />
          <MissionControlAnalytics stats={stats} />
        </div>

        <div
          className={`hidden border-l border-cyan-500/10 lg:block lg:w-56 xl:w-64 ${
            panelOpen ? "xl:block" : ""
          } ${panelOpen ? "max-xl:hidden" : ""}`}
        >
          <MissionControlOperatorPanel profile={profile} focusAreas={focusAreas} stats={stats} />
        </div>
      </div>

      <MissionControlFeed items={feed} />
    </div>
  );
}
