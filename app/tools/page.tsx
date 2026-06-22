"use client";

import PracticalModuleHub from "@/components/practical/PracticalModuleHub";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.tools;

export default function ToolsModulePage() {
  return (
    <PracticalModuleHub
      module="tools"
      title={config.title}
      description={config.description}
      allowedTypes={[...config.allowedTypes]}
      modulePath="tools"
      accentClass="text-purple-400"
    />
  );
}
