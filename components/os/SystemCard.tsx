"use client";

import Link from "next/link";

type SystemCardProps = {
  title: string;
  description: string;
  route: string;
  missionCount: number;
  completionPercentage: number;
  status?: string;
};

export default function SystemCard({
  title,
  description,
  route,
  missionCount,
  completionPercentage,
  status = "ONLINE",
}: SystemCardProps) {
  return (
    <Link
      href={route}
      className="group relative overflow-hidden rounded-2xl border border-green-900/50 bg-black/40 p-6 backdrop-blur-md transition hover:border-green-600/60 hover:bg-green-950/25"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">System Module</p>
          <h3 className="mt-3 text-2xl font-semibold text-green-300 transition group-hover:text-white">
            {title}
          </h3>
        </div>

        <span className="flex items-center gap-2 rounded-full border border-green-800/60 bg-green-950/40 px-3 py-1 text-xs font-medium text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          {status}
        </span>
      </div>

      <p className="relative mt-4 text-sm leading-6 text-gray-400">{description}</p>

      <div className="relative mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500">
          <span>Missions</span>
          <span>{missionCount}</span>
        </div>

        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500">
          <span>Completion</span>
          <span className="text-green-400">{completionPercentage}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-green-950/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-700 to-green-400 transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
