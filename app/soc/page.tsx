"use client";

import Achievements from "@/components/mission/Achievements";
import DailyChallenge from "@/components/cyber/DailyChallenge";
import NexusModuleDashboard from "@/components/os/NexusModuleDashboard";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.soc;

export default function SocModulePage() {
  return (
    <NexusModuleDashboard
      title={config.title}
      description={config.description}
      allowedTypes={[...config.allowedTypes]}
      modulePath="soc"
      showStats
      showCategoryFilters
      headerSlot={<DailyChallenge />}
      footerSlot={<Achievements />}
    />
  );
}
