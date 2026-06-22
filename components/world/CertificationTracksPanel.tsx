"use client";

import { CERTIFICATION_TRACKS, isTrackComplete, trackProgressPercent } from "@/lib/world/certificationTracks";
import { useAnalyst } from "@/context/AnalystContext";
import { useMissions } from "@/context/MissionsContext";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";

export default function CertificationTracksPanel() {
  const mounted = useMounted();
  const analyst = useAnalyst();
  const missions = useMissions();
  const completedTypes = missions
    .filter(mission => analyst.completedMissionIds?.includes(mission.id))
    .map(mission => mission.type);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-green-400">Certification Tracks</h2>
      <p className="mt-2 text-sm text-gray-500">
        Complete roadmap milestones to unlock printable certificates. XP progression unchanged.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CERTIFICATION_TRACKS.map(track => {
          const complete = isTrackComplete(
            track,
            analyst.xp,
            analyst.completed,
            completedTypes
          );
          const progress = trackProgressPercent(track, analyst.xp, analyst.completed);
          return (
            <article
              key={track.id}
              className="rounded-xl border border-green-900/40 bg-black/40 p-5"
            >
              <h3 className="text-lg text-green-300">{track.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{track.description}</p>
              <div className="mt-4 h-2 rounded bg-green-950">
                <div
                  className="h-2 rounded bg-green-500 transition-all"
                  style={{ width: mounted ? `${progress}%` : "0%" }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">{mounted ? progress : 0}% · {track.requiredXp} XP · {track.requiredMissions} missions</p>
              {complete ? (
                <Link
                  href={`/certs/${track.id}`}
                  className="mt-4 inline-block border border-green-500 px-4 py-2 text-sm text-green-400"
                >
                  View certificate →
                </Link>
              ) : (
                <p className="mt-4 text-xs text-gray-600">Keep completing {track.missionTypes.join(", ")} labs</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
