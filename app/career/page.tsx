"use client";

import PracticalModuleHub from "@/components/practical/PracticalModuleHub";
import CareerWeekPanel from "@/components/world/CareerWeekPanel";
import WorldHud from "@/components/world/WorldHud";
import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

const config = NEXUS_OS_MODULES.career;

export default function CareerModulePage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-12 pt-20 font-mono text-green-400 sm:px-6 sm:pb-20 sm:pt-28">
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
