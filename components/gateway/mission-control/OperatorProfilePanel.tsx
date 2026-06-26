"use client";

import { motion } from "framer-motion";

import { useSound } from "@/context/SoundContext";
import type { NexusProfile } from "@/lib/nexusData";

type Props = {
  profile: NexusProfile;
  onClose: () => void;
};

export default function OperatorProfilePanel({ profile, onClose }: Props) {
  const { playSound } = useSound();
  const identity = profile.identity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-cyan-500/25 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/10 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500">Operator Profile</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{identity.name}</h2>
            <p className="mt-1 text-sm text-cyan-300">{identity.headline}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound("ui.panel.close");
              onClose();
            }}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-cyan-200"
          >
            ← Back
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-300">
          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-500">Professional Summary</h3>
            <div className="mt-3 space-y-3">
              {identity.summary.split(/\n+/).filter(Boolean).map(paragraph => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>

          {profile.education.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-slate-500">Education</h3>
              <ul className="mt-3 space-y-3">
                {profile.education.map(edu => (
                  <li key={`${edu.degree}-${edu.period}`} className="rounded-lg border border-slate-800 p-3">
                    <p className="font-medium text-green-300">{edu.degree}</p>
                    <p className="text-slate-400">{edu.institution}</p>
                    <p className="text-xs text-slate-500">{edu.period}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.experience.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-slate-500">
                Leadership & Operations Experience
              </h3>
              <ul className="mt-3 space-y-3">
                {profile.experience.map(job => (
                  <li key={`${job.role}-${job.period}`} className="rounded-lg border border-slate-800 p-3">
                    <p className="font-medium text-cyan-200">{job.role}</p>
                    <p className="text-slate-400">{job.company}</p>
                    <p className="text-xs text-slate-500">{job.period}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-xs uppercase tracking-widest text-slate-500">Current Objectives</h3>
            <p className="mt-3 text-cyan-200">{identity.headline}</p>
            {profile.skills?.cybersecurity?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.skills.cybersecurity.slice(0, 6).map(skill => (
                  <span
                    key={skill}
                    className="rounded border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
