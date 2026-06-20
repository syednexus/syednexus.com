"use client";

import { ReactNode } from "react";

import { AnalystProvider } from "@/context/AnalystProvider";
import { MissionsProvider } from "@/context/MissionsProvider";
import { NexusProvider } from "@/context/NexusContext";
import MissionEngine from "@/components/nexus/mission/MissionEngine";

export default function NexusOSProviders({ children }: { children: ReactNode }) {
  return (
    <NexusProvider>
      <MissionsProvider>
        <AnalystProvider>
          {children}
          <MissionEngine />
        </AnalystProvider>
      </MissionsProvider>
    </NexusProvider>
  );
}
