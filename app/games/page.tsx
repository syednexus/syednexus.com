"use client";

import PracticalModuleHub from "@/components/practical/PracticalModuleHub";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.games;

export default function GamesModulePage() {
  return (
    <PracticalModuleHub
      module="games"
      title={config.title}
      description={config.description}
      allowedTypes={[...config.allowedTypes]}
      modulePath="games"
      accentClass="text-green-400"
    />
  );
}
