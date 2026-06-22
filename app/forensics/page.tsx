"use client";

import PracticalModuleHub from "@/components/practical/PracticalModuleHub";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.forensics;

export default function ForensicsModulePage() {
  return (
    <PracticalModuleHub
      module="forensics"
      title={config.title}
      description={config.description}
      allowedTypes={[...config.allowedTypes]}
      modulePath="forensics"
      accentClass="text-cyan-400"
    />
  );
}
