"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import { safeExternalHref } from "@/lib/security/safeHref";

import { QUICK_LAUNCH } from "./navigation";
import type { MissionControlStats } from "./types";
import type { NexusProfile } from "@/lib/nexusData";

type Props = {
  profile: NexusProfile;
  focusAreas: string[];
  stats: MissionControlStats;
};

export default function MissionControlOperatorPanel({ profile, focusAreas, stats }: Props) {
  const { playSound } = useSound();
  const identity = profile.identity;
  const currentRole = profile.experience?.[0];
  const currentStudy = profile.education?.[0];

  return (
    <aside className="flex h-full flex-col border-l border-cyan-500/15 bg-slate-950/80 backdrop-blur-md">
      <div className="border-b border-cyan-500/10 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">Operator Intelligence</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 text-sm">
        <section>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Name</p>
          <p className="mt-1 text-lg font-semibold text-white">{identity.name}</p>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Location</p>
          <p className="mt-1 text-slate-300">{identity.location}</p>
        </section>

        {currentRole && (
          <section>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Position</p>
            <p className="mt-1 text-cyan-200">{currentRole.role}</p>
            <p className="text-xs text-slate-500">{currentRole.company}</p>
          </section>
        )}

        {currentStudy && (
          <section>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Study</p>
            <p className="mt-1 text-green-300">{currentStudy.degree}</p>
            <p className="text-xs text-slate-500">{currentStudy.institution}</p>
          </section>
        )}

        {focusAreas.length > 0 && (
          <section>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Focus</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {focusAreas.map(area => (
                <span
                  key={area}
                  className="rounded border border-cyan-500/25 bg-cyan-500/5 px-2 py-0.5 text-[10px] text-cyan-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-2">
          {identity.github && safeExternalHref(identity.github) !== "#" && (
            <a
              href={safeExternalHref(identity.github)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound("ui.click")}
              className="block rounded-lg border border-slate-700/60 px-3 py-2 text-xs text-slate-300 transition hover:border-purple-400/40 hover:text-purple-200"
            >
              GitHub
            </a>
          )}
          {identity.linkedin && safeExternalHref(identity.linkedin) !== "#" && (
            <a
              href={safeExternalHref(identity.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound("ui.click")}
              className="block rounded-lg border border-slate-700/60 px-3 py-2 text-xs text-slate-300 transition hover:border-blue-400/40 hover:text-blue-200"
            >
              LinkedIn
            </a>
          )}
          {identity.resume && safeExternalHref(identity.resume) !== "#" && (
            <a
              href={safeExternalHref(identity.resume)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound("ui.click")}
              className="block rounded-lg border border-slate-700/60 px-3 py-2 text-xs text-slate-300 transition hover:border-green-400/40 hover:text-green-200"
            >
              Resume
            </a>
          )}
        </section>

        <section>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">Quick Launch</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LAUNCH.map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (item.label === "Vault") playSound("vault.unlock");
                  else if (item.label === "SOC") playSound("mission.start");
                  else playSound("ui.click");
                }}
                className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2 py-2 text-center text-[10px] tracking-wider text-cyan-200 transition hover:bg-cyan-500/15"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Operator Status</p>
          <p className="mt-2 text-xs text-slate-400">
            {stats.completedMissions} missions · {stats.xp} XP · Rank {stats.databaseHealthy ? "online" : "syncing"}
          </p>
        </section>
      </div>
    </aside>
  );
}
