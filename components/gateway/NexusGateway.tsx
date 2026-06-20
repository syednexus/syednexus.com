"use client";

import Link from "next/link";

const modules = [
  {
    name: "Portfolio",
    desc: "Professional Identity & Journey",
    path: "/portfolio",
    status: "PUBLIC",
  },
  {
    name: "SOC Defender",
    desc: "Realistic Blue Team Simulations",
    path: "/soc",
    status: "TRAINING",
  },
  {
    name: "Attack Lab",
    desc: "Offensive Security Missions",
    path: "/attack",
    status: "LAB",
  },
  {
    name: "Forensics",
    desc: "Digital Forensics Investigations",
    path: "/forensics",
    status: "LAB",
  },
  {
    name: "Cyber Range",
    desc: "Hands-on Security Labs",
    path: "/nexus",
    status: "LAB",
  },
  {
    name: "Games",
    desc: "Cyber & Logic Challenges",
    path: "/games",
    status: "PLAY",
  },
  {
    name: "Tools",
    desc: "Security Tool Simulations",
    path: "/tools",
    status: "TRAINING",
  },
  {
    name: "Career",
    desc: "Professional Scenario Training",
    path: "/career",
    status: "GROWTH",
  },
  {
    name: "Blogs",
    desc: "Research & Articles",
    path: "/blogs",
    status: "PUBLIC",
  },
  {
    name: "MedCore",
    desc: "Healthcare Security Research",
    path: "/medcore",
    status: "RESEARCH",
  },
  {
    name: "Vault",
    desc: "Private Knowledge System",
    path: "/vault",
    status: "LOCKED",
  },
  {
    name: "Security",
    desc: "Nexus Transparency Center",
    path: "/security",
    status: "INFO",
  },
];

export default function NexusGateway() {
  return (
    <main className="min-h-screen bg-black px-8 py-20 text-green-400">
      <section className="mx-auto max-w-7xl">
        <div className="mb-14">
          <h1 className="mb-5 text-6xl font-bold tracking-widest">NEXUS OS</h1>

          <p className="max-w-3xl text-gray-400">
            Select a module. Each environment routes into mission cards, the shared
            mission engine, and your Nexus XP rank progression.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <Link
              href={module.path}
              key={module.name}
              className="group rounded-2xl border border-green-800/50 bg-black/40 p-6 transition hover:bg-green-950/20"
            >
              <span className="text-xs text-gray-500">{module.status}</span>

              <h3 className="mt-5 text-2xl group-hover:text-white">{module.name}</h3>

              <p className="mt-3 text-sm text-gray-400">{module.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
