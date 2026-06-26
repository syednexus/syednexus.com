"use client";

import { useNexusData } from "@/hooks/useNexusData";
import { safeExternalHref } from "@/lib/security/safeHref";

import { CmsLoadingSkeleton } from "./CmsLoadingSkeleton";
import DestinationShell from "./DestinationShell";
import { useHydratedCmsReady } from "./useHydratedCmsReady";

const SECURITY_STACK = [
  "Google OAuth",
  "MFA",
  "NextAuth",
  "Audit Logging",
  "Rate Limiting",
  "Cloudflare WAF",
  "Vault Access Control"
];

export default function ProjectsPageContent() {
  const ready = useHydratedCmsReady();
  const profile = useNexusData();
  const identity = profile.identity;
  const projects = profile.projects || [];

  if (!ready) {
    return (
      <DestinationShell
        title="Project Intelligence Center"
        subtitle="Production projects, architecture, technologies and deployment posture — all data from Vault CMS."
      >
        <CmsLoadingSkeleton rows={4} />
      </DestinationShell>
    );
  }

  return (
    <DestinationShell
      title="Project Intelligence Center"
      subtitle="Production projects, architecture, technologies and deployment posture — all data from Vault CMS."
    >
      <div className="grid gap-6">
        {projects.length === 0 ? (
          <p className="text-slate-500">No projects indexed yet.</p>
        ) : (
          projects.map(project => (
            <article
              key={project.name}
              className="rounded-2xl border border-amber-500/20 bg-slate-900/40 p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-500/80">{project.category}</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{project.name}</h2>
                </div>
                <span className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-200">
                  {project.status}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">{project.description}</p>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-slate-500">Technologies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="rounded border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/nexus/i.test(project.name) && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 p-4">
                    <p className="text-xs uppercase text-slate-500">Security Stack</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SECURITY_STACK.map(item => (
                        <span key={item} className="text-[10px] text-purple-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-800 p-4">
                    <p className="text-xs uppercase text-slate-500">Live Links</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <a href="/" className="block text-cyan-300 hover:underline">
                        Mission Control (Home)
                      </a>
                      {identity.github && safeExternalHref(identity.github) !== "#" && (
                        <a
                          href={safeExternalHref(identity.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-cyan-300 hover:underline"
                        >
                          GitHub Repository
                        </a>
                      )}
                      <a href="/vault" className="block text-cyan-300 hover:underline">
                        Vault CMS
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </DestinationShell>
  );
}
