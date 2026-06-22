"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useNexus } from "@/context/NexusContext";
import { useNexusSound } from "@/components/nexus/NexusSound";
import { getAchievementTier } from "@/lib/achievementTier";
import NexusEventToast from "./NexusEventToast";
import SpecialistBootUnlock from "./SpecialistBootUnlock";
import SpecialistSiemAlert from "./SpecialistSiemAlert";

type SpecialistPhase = "boot" | "siem";

export default function AchievementOverlay() {
  const { recentUnlock, clearRecentUnlock } = useNexus();
  const { play } = useNexusSound();
  const [specialistPhase, setSpecialistPhase] = useState<SpecialistPhase>("boot");

  const tier = recentUnlock
    ? getAchievementTier(recentUnlock)
    : "standard";

  useEffect(() => {
    if (!recentUnlock) {
      return;
    }

    setSpecialistPhase("boot");
    play(tier === "specialist" ? "specialist" : "achievement");

    if (tier === "standard") {
      const timer = window.setTimeout(() => {
        clearRecentUnlock();
      }, 3500);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [recentUnlock, tier, play, clearRecentUnlock]);

  useEffect(() => {
    if (!recentUnlock || tier !== "specialist" || specialistPhase !== "siem") {
      return;
    }

    const timer = window.setTimeout(() => {
      clearRecentUnlock();
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [recentUnlock, tier, specialistPhase, clearRecentUnlock]);

  if (!recentUnlock) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {tier === "standard" && (
          <NexusEventToast
            key={`terminal-${recentUnlock.id}`}
            event={{
              title: recentUnlock.title,
              description: recentUnlock.description,
              icon: recentUnlock.icon
            }}
            onDismiss={clearRecentUnlock}
          />
        )}

        {tier === "specialist" && specialistPhase === "boot" && (
          <SpecialistBootUnlock
            key={`boot-${recentUnlock.id}`}
            achievement={recentUnlock}
            onComplete={() => setSpecialistPhase("siem")}
          />
        )}

        {tier === "specialist" && specialistPhase === "siem" && (
          <SpecialistSiemAlert
            key={`siem-${recentUnlock.id}`}
            achievement={recentUnlock}
            onDismiss={clearRecentUnlock}
          />
        )}
      </AnimatePresence>
    </>
  );
}
