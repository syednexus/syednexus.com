"use client";

import { useNexusData } from "@/hooks/useNexusData";
import { safeExternalHref } from "@/lib/security/safeHref";

import { CmsLoadingSkeleton } from "./CmsLoadingSkeleton";
import DestinationShell from "./DestinationShell";
import { useHydratedCmsReady } from "./useHydratedCmsReady";

export default function ContactPageContent() {
  const ready = useHydratedCmsReady();
  const profile = useNexusData();
  const identity = profile.identity;
  const email = Array.isArray(identity.email) ? identity.email[0] : identity.email;

  const contacts = [
    email ? { name: "Email", value: email, href: `mailto:${email}` } : null,
    identity.github
      ? {
          name: "GitHub",
          value: identity.github.replace(/^https?:\/\//, ""),
          href: safeExternalHref(identity.github)
        }
      : null,
    identity.linkedin
      ? {
          name: "LinkedIn",
          value: identity.linkedin.replace(/^https?:\/\//, ""),
          href: safeExternalHref(identity.linkedin)
        }
      : null,
    identity.resume
      ? { name: "Resume", value: "Download PDF", href: safeExternalHref(identity.resume) }
      : null
  ].filter((item): item is { name: string; value: string; href: string } => {
    if (!item) return false;
    return item.href !== "#";
  });

  if (!ready) {
    return (
      <DestinationShell
        title="Contact"
        subtitle="Connect for cybersecurity opportunities, collaboration and professional enquiries."
      >
        <CmsLoadingSkeleton rows={3} />
      </DestinationShell>
    );
  }

  return (
    <DestinationShell
      title="Contact"
      subtitle="Connect for cybersecurity opportunities, collaboration and professional enquiries."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {contacts.map(item => (
          <a
            key={item.name}
            href={item.href}
            target={item.name === "Email" ? undefined : "_blank"}
            rel={item.name === "Email" ? undefined : "noopener noreferrer"}
            className="min-h-36 rounded-xl border border-slate-700/60 bg-slate-900/50 p-8 transition hover:border-cyan-400/50"
          >
            <h3 className="text-xl text-cyan-100">{item.name}</h3>
            <p className="mt-5 break-all text-slate-400">{item.value}</p>
          </a>
        ))}
      </div>
    </DestinationShell>
  );
}
