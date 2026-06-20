"use client";

import { useMemo } from "react";

import { useMissions } from "@/context/MissionsProvider";
import { MODULE_MISSION_TYPES, MissionType } from "@/types/mission";
import OperatorProfile from "@/components/os/OperatorProfile";
import SystemCard from "@/components/os/SystemCard";

type SystemDefinition = {
  title: string;
  description: string;
  route: string;
  allowedTypes: MissionType[];
};

const SYSTEMS: SystemDefinition[] = [
  {
    title: "Cyber Games",
    description: "Linux, networking, packet analysis challenges",
    route: "/games",
    allowedTypes: MODULE_MISSION_TYPES.games,
  },
  {
    title: "SOC Simulator",
    description: "Investigate alerts, analyze SIEM, respond incidents",
    route: "/soc",
    allowedTypes: MODULE_MISSION_TYPES.soc,
  },
  {
    title: "Attack Lab",
    description: "Recon, exploitation, web attacks",
    route: "/attack",
    allowedTypes: MODULE_MISSION_TYPES.attack,
  },
  {
    title: "Digital Forensics",
    description: "Evidence, memory, disk investigations",
    route: "/forensics",
    allowedTypes: MODULE_MISSION_TYPES.forensics,
  },
  {
    title: "AI Security",
    description: "Prompt injection, phishing AI detection",
    route: "/ai-lab",
    allowedTypes: MODULE_MISSION_TYPES.aiLab,
  },
  {
    title: "Tool Playground",
    description: "Nmap, Wireshark, Burp, Hydra simulations",
    route: "/tools",
    allowedTypes: MODULE_MISSION_TYPES.tools,
  },
  {
    title: "Career Simulator",
    description: "SOC analyst and pentester career scenarios",
    route: "/career",
    allowedTypes: MODULE_MISSION_TYPES.career,
  },
];

function getModuleCompletion(
  allowedTypes: MissionType[],
  getMissionsByTypes: ReturnType<typeof useMissions>["getMissionsByTypes"],
  isMissionCompleted: ReturnType<typeof useMissions>["isMissionCompleted"],
) {
  const moduleMissions = getMissionsByTypes(allowedTypes);
  const missionCount = moduleMissions.length;

  if (missionCount === 0) {
    return { missionCount: 0, completionPercentage: 0 };
  }

  const completedCount = moduleMissions.filter((mission) =>
    isMissionCompleted(mission.slug),
  ).length;

  return {
    missionCount,
    completionPercentage: Math.round((completedCount / missionCount) * 100),
  };
}

export default function NexusOS() {
  const { getMissionsByTypes, isMissionCompleted } = useMissions();

  const systems = useMemo(
    () =>
      SYSTEMS.map((system) => ({
        ...system,
        ...getModuleCompletion(
          system.allowedTypes,
          getMissionsByTypes,
          isMissionCompleted,
        ),
      })),
    [getMissionsByTypes, isMissionCompleted],
  );

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-green-400 md:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-green-900/40 pb-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-gray-500">
                Cyber Learning OS
              </p>
              <h1 className="mt-3 text-5xl font-bold tracking-[0.2em] text-green-300 md:text-6xl">
                NEXUS OS
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
                Command center for cyber training modules. Select a system to enter
                mission environments powered by the shared mission engine and XP rank
                progression.
              </p>
            </div>

            <div className="rounded-xl border border-green-900/40 bg-green-950/20 px-4 py-3 font-mono text-xs text-green-500">
              <p>&gt; nexus-os --status online</p>
              <p>&gt; modules loaded: {systems.length}</p>
            </div>
          </div>

          <OperatorProfile />
        </header>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.35em] text-gray-500">
            System Grid
          </h2>
          <span className="text-xs text-gray-600">All systems operational</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {systems.map((system) => (
            <SystemCard
              key={system.route}
              title={system.title}
              description={system.description}
              route={system.route}
              missionCount={system.missionCount}
              completionPercentage={system.completionPercentage}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
