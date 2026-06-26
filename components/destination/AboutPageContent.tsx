"use client";

import { useNexusData } from "@/hooks/useNexusData";
import { deriveTimeline } from "@/components/gateway/mission-control/deriveTimeline";

import { CmsLoadingSkeleton } from "./CmsLoadingSkeleton";
import DestinationShell from "./DestinationShell";
import { useHydratedCmsReady } from "./useHydratedCmsReady";

export default function AboutPageContent() {
  const ready = useHydratedCmsReady();
  const profile = useNexusData();
  const identity = profile.identity;
  const timeline = deriveTimeline(profile);

  if (!ready) {
    return (
      <DestinationShell
        title="Operator Profile"
        subtitle="Professional identity, career transition and cybersecurity objectives — sourced from Vault CMS."
      >
        <CmsLoadingSkeleton rows={5} />
      </DestinationShell>
    );
  }

  return (
    <DestinationShell
      title="Operator Profile"
      subtitle="Professional identity, career transition and cybersecurity objectives — sourced from Vault CMS."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5 text-sm leading-8 text-slate-300 sm:text-base">
          <h2 className="text-xl font-semibold text-cyan-100">Professional Summary</h2>
          {identity.summary.split(/\n+/).filter(Boolean).map(paragraph => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </section>

        <aside className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Name</p>
            <p className="mt-1 text-lg text-white">{identity.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Location</p>
            <p className="text-slate-300">{identity.location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Headline</p>
            <p className="text-cyan-200">{identity.headline}</p>
          </div>
        </aside>
      </div>

      <section id="journey" className="mt-14">
        <h2 className="text-2xl font-bold text-green-300">Career Journey</h2>
        <ol className="relative mt-8 space-y-0 border-l border-green-500/30 pl-6">
          {timeline.map(event => (
            <li key={event.id} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border border-green-400 bg-green-400/30" />
              <p className="font-medium text-slate-100">{event.label}</p>
              {event.period && <p className="text-xs text-slate-500">{event.period}</p>}
            </li>
          ))}
        </ol>
      </section>

      {profile.education.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Education</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profile.education.map(edu => (
              <div key={`${edu.degree}-${edu.period}`} className="rounded-xl border border-slate-800 p-5">
                <p className="text-green-300">{edu.degree}</p>
                <p className="text-slate-400">{edu.institution}</p>
                <p className="mt-1 text-xs text-slate-500">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.experience.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Leadership & Operations</h2>
          <div className="mt-6 space-y-4">
            {profile.experience.map(job => (
              <div key={`${job.role}-${job.period}`} className="rounded-xl border border-slate-800 p-5">
                <p className="text-cyan-200">{job.role}</p>
                <p className="text-slate-400">{job.company}</p>
                <p className="text-xs text-slate-500">{job.period}</p>
                <ul className="mt-3 list-inside list-disc text-sm text-slate-400">
                  {job.details?.slice(0, 3).map(detail => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </DestinationShell>
  );
}
