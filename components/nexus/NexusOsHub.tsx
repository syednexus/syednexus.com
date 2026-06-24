"use client";

import Link from "next/link";

import { NEXUS_OS_NAV } from "@/lib/nexusNavigation";

export default function NexusOsHub() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 font-mono text-green-400 sm:px-8 sm:py-20">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-widest text-gray-500">root@nexus:/os#</p>

        <h1 className="mt-4 text-2xl font-bold tracking-widest text-green-300 sm:text-4xl lg:text-6xl">
          NEXUS OS
        </h1>

        <p className="mt-5 max-w-3xl text-sm text-gray-400 sm:text-base">
          Cyber Learning OS — hands-on simulations for blue team, red team, forensics, tools, career
          paths, and AI security. Select a module to launch interactive labs.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {NEXUS_OS_NAV.map(module => (
            <Link
              key={module.path}
              href={module.path}
              className="group rounded-2xl border border-green-800/50 bg-black/40 p-6 transition hover:border-green-600 hover:bg-green-950/20"
            >
              <span className="text-xs text-gray-500">{module.status}</span>
              <h2 className="mt-4 text-xl font-bold text-green-300 group-hover:text-white sm:text-2xl">
                {module.name}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm text-gray-500">{module.desc}</p>
              <p className="mt-5 text-sm text-green-500 group-hover:text-green-400">▶ LAUNCH MODULE</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="border border-green-800 px-4 py-2 text-gray-400 hover:text-green-400">
            ← Gateway
          </Link>
          <Link href="/portfolio" className="border border-green-800 px-4 py-2 text-gray-400 hover:text-green-400">
            Portfolio
          </Link>
          <Link href="/vault" className="border border-green-800 px-4 py-2 text-gray-400 hover:text-green-400">
            Vault
          </Link>
        </div>
      </section>
    </main>
  );
}
