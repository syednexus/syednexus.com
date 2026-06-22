"use client";

import PracticalModuleHub from "@/components/practical/PracticalModuleHub";
import CareerWeekPanel from "@/components/world/CareerWeekPanel";
import WorldHud from "@/components/world/WorldHud";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.career;

export default function CareerModulePage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-28 font-mono text-green-400">
      <div className="mx-auto max-w-6xl">
        <WorldHud />
        <CareerWeekPanel />
        <PracticalModuleHub
          module="career"
          title={config.title}
          description={config.description}
          allowedTypes={[...config.allowedTypes]}
          modulePath="career"
          accentClass="text-blue-400"
        />
      </div>
    </main>
  );
}
