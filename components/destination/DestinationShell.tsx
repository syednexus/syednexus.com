"use client";

import type { ReactNode } from "react";

import BackToGlobe from "@/components/gateway/BackToGlobe";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function DestinationShell({ title, subtitle, children }: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f3057,#020617_60%)] pt-24 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        <BackToGlobe className="mb-8" />
        <header className="mb-10 border-b border-cyan-500/15 pb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500">Nexus Destination</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-slate-400">{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
