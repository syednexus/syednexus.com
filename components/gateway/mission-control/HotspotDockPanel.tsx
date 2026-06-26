"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import { saveGlobeState } from "@/lib/globeState";
import type { NexusProfile } from "@/lib/nexusData";
import type { GlobeHotspot, TimelineEvent } from "./types";

type Props = {
  hotspot: GlobeHotspot;
  profile: NexusProfile;
  timeline: TimelineEvent[];
  focusId: string | null;
  onClose: () => void;
};

export default function HotspotDockPanel({
  hotspot,
  profile,
  timeline,
  focusId,
  onClose
}: Props) {
  const { playSound } = useSound();
  const identity = profile.identity;

  const navigate = () => {
    saveGlobeState({
      focusId,
      activeHotspot: hotspot.id,
      dockOpen: true
    });
    if (hotspot.action.sound === "soc") playSound("mission.start");
    else if (hotspot.action.sound === "vault") playSound("vault.unlock");
    else playSound("ui.click");
  };

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="flex h-full flex-col border-l border-cyan-500/20 bg-slate-950/95 backdrop-blur-md"
    >
      <header className="flex items-start justify-between gap-3 border-b border-cyan-500/10 px-4 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">Node Intelligence</p>
          <h2 className="mt-1 text-lg font-bold text-white">{hotspot.label}</h2>
          <p className="mt-1 text-xs text-slate-400">{hotspot.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            playSound("ui.panel.close");
            onClose();
          }}
          className="shrink-0 rounded-lg border border-slate-600 px-2.5 py-1 text-[10px] text-slate-400 hover:border-cyan-500/40 hover:text-cyan-200"
          aria-label="Close panel"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 text-sm leading-relaxed text-slate-300">
        {hotspot.id === "australia" && (
          <div className="space-y-4">
            <p className="text-cyan-100">{identity.name}</p>
            <p>{identity.headline}</p>
            <p className="text-slate-400">{identity.location}</p>
            <div className="space-y-2">
              {identity.summary
                .split(/\n+/)
                .filter(Boolean)
                .slice(0, 3)
                .map(line => (
                  <p key={line.slice(0, 40)}>{line}</p>
                ))}
            </div>
          </div>
        )}

        {hotspot.id === "india" && (
          <ol className="space-y-3 border-l border-green-500/30 pl-4">
            {timeline.map(event => (
              <li key={event.id}>
                <p className="font-medium text-slate-100">{event.label}</p>
                {event.period && <p className="text-xs text-slate-500">{event.period}</p>}
              </li>
            ))}
          </ol>
        )}

        {hotspot.id === "europe" && (
          <div className="space-y-3">
            {profile.projects.slice(0, 4).map(project => (
              <div key={project.name} className="rounded-lg border border-slate-800 p-3">
                <p className="font-medium text-amber-200">{project.name}</p>
                <p className="mt-1 text-xs text-slate-500">{project.status}</p>
                <p className="mt-2 text-xs text-slate-400">{project.description}</p>
              </div>
            ))}
          </div>
        )}

        {hotspot.id === "north-america" && (
          <div className="space-y-3">
            <p>
              DFIR case studies, investigation write-ups and SOC learning notes from the Syed Nexus
              ecosystem.
            </p>
            {(profile.blogs.posts as Array<{ id: string | number; title: string; category: string }>)
              .slice(0, 3)
              .map(post => (
              <div key={post.id} className="rounded-lg border border-slate-800 p-3">
                <p className="text-cyan-200">{post.title}</p>
                <p className="mt-1 text-xs text-slate-500">{post.category}</p>
              </div>
            ))}
          </div>
        )}

        {hotspot.id === "middle-east" && (
          <p>
            Healthcare and pharmaceutical security research — bridging clinical operations knowledge
            with modern cyber defence.
          </p>
        )}

        {hotspot.id === "cloud" && (
          <div className="space-y-2">
            <p>Production platform stack powering Syed Nexus.</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {["Next.js", "Prisma", "PostgreSQL", "Docker", "Redis", "Cloudflare", "NextAuth"].map(
                tech => (
                  <span
                    key={tech}
                    className="rounded border border-purple-500/25 px-2 py-0.5 text-[10px] text-purple-200"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-cyan-500/10 p-4">
        <Link
          href={hotspot.action.href}
          onClick={navigate}
          className="flex w-full items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
        >
          Open {hotspot.label} →
        </Link>
      </footer>
    </motion.aside>
  );
}
