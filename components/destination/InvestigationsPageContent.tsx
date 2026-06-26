"use client";

import Link from "next/link";

import { useNexusData } from "@/hooks/useNexusData";

import { CmsLoadingSkeleton } from "./CmsLoadingSkeleton";
import DestinationShell from "./DestinationShell";
import { useHydratedCmsReady } from "./useHydratedCmsReady";

const INVESTIGATION_KEYWORDS = /investig|forensic|dfir|soc|incident|threat|malware|case/i;

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === "string" && tags.trim()) {
    return tags.split(",").map(tag => tag.trim()).filter(Boolean);
  }
  return [];
}

export default function InvestigationsPageContent() {
  const ready = useHydratedCmsReady();
  const profile = useNexusData();
  const posts = (profile.blogs?.posts ?? []) as Array<{
    id: string | number;
    title: string;
    category: string;
    content: string;
    tags?: unknown;
    date: string;
  }>;

  const investigations = posts.filter(post => {
    const tags = normalizeTags(post.tags);
    return (
      INVESTIGATION_KEYWORDS.test(post.category) ||
      tags.some(tag => INVESTIGATION_KEYWORDS.test(tag)) ||
      INVESTIGATION_KEYWORDS.test(post.title)
    );
  });

  const displayPosts = investigations.length > 0 ? investigations : posts;

  if (!ready) {
    return (
      <DestinationShell
        title="Investigations"
        subtitle="Case studies, DFIR write-ups and security research notes from the Nexus knowledge base."
      >
        <CmsLoadingSkeleton rows={4} />
      </DestinationShell>
    );
  }

  return (
    <DestinationShell
      title="Investigations"
      subtitle="Case studies, DFIR write-ups and security research notes from the Nexus knowledge base."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/forensics"
          className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/10"
        >
          Forensics Lab →
        </Link>
        <Link
          href="/soc"
          className="rounded-lg border border-blue-500/30 px-4 py-2 text-sm text-blue-200 hover:bg-blue-500/10"
        >
          SOC Simulator →
        </Link>
      </div>

      <div className="grid gap-5">
        {displayPosts.length === 0 ? (
          <p className="text-slate-500">No investigation write-ups published yet.</p>
        ) : (
          displayPosts.map(post => (
            <Link
              key={post.id}
              href={`/blogs/${post.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-cyan-500/40"
            >
              <p className="text-xs uppercase tracking-widest text-cyan-500/80">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">{post.content}</p>
              <p className="mt-3 text-xs text-slate-600">{post.date}</p>
            </Link>
          ))
        )}
      </div>
    </DestinationShell>
  );
}
