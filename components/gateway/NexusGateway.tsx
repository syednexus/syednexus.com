"use client";

import Link from "next/link";

import { GATEWAY_MODULES } from "@/lib/nexusNavigation";

export default function NexusGateway() {
  const osHub = GATEWAY_MODULES.find(module => module.path === "/nexus");
  const modules = GATEWAY_MODULES.filter(module => module.path !== "/nexus");

  return (
    <main className="min-h-screen bg-black px-5 py-16 font-mono text-green-400 sm:px-8 sm:py-20">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="mb-5 text-2xl font-bold tracking-widest sm:text-4xl lg:text-6xl">SYED NEXUS</h1>
          <p className="max-w-3xl text-sm text-gray-400 sm:text-base">
            Cybersecurity portfolio and interactive training environments. Enter Nexus OS for
            hands-on labs, or explore public modules below.
          </p>
        </div>

        {osHub && (
          <Link
            href={osHub.path}
            className="mb-12 block rounded-2xl border border-green-500 bg-green-950/30 p-5 transition hover:border-green-400 hover:bg-green-950/50 sm:p-8"
          >
            <span className="text-xs text-green-500">{osHub.status}</span>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{osHub.name}</h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">{osHub.desc}</p>
            <p className="mt-6 text-green-400">▶ ENTER NEXUS OS</p>
          </Link>
        )}

        <p className="mb-6 text-xs uppercase tracking-widest text-gray-600">All environments</p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map(module => (
            <Link
              key={module.path}
              href={module.path}
              className="group rounded-2xl border border-green-800/50 bg-black/40 p-6 transition hover:border-green-600 hover:bg-green-950/20"
            >
              <span className="text-xs text-gray-500">{module.status}</span>
              <h3 className="mt-4 text-xl font-bold group-hover:text-white sm:text-2xl">{module.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm text-gray-400">{module.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
