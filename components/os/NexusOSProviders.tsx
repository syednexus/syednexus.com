"use client";

import { ReactNode } from "react";

import { MissionsProvider } from "@/context/MissionsProvider";
import { NexusProvider } from "@/context/NexusContext";
import MissionEngine from "@/components/nexus/mission/MissionEngine";

export default function NexusOSProviders({ children }: { children: ReactNode }) {
  return (
    <NexusProvider>
      <MissionsProvider>
        {children}
        <MissionEngine />
      </MissionsProvider>
    </NexusProvider>
  );
}
