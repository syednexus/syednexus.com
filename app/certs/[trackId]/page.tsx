"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useAnalyst } from "@/context/AnalystContext";
import { useNexusData } from "@/hooks/useNexusData";
import { getTrack, isTrackComplete, type CertificateData } from "@/lib/world/certificationTracks";
import { useMissions } from "@/context/MissionsContext";

export default function CertificatePage() {
  const { trackId } = useParams<{ trackId: string }>();
  const analyst = useAnalyst();
  const profile = useNexusData();
  const missions = useMissions();
  const track = getTrack(String(trackId));

  const completedTypes = useMemo(
    () =>
      missions
        .filter(mission => analyst.completedMissionIds.includes(mission.id))
        .map(mission => mission.type),
    [missions, analyst.completedMissionIds]
  );

  if (!track) {
    return (
      <main className="pt-32 px-10 text-gray-400">
        Certificate track not found.
      </main>
    );
  }

  const complete = isTrackComplete(track, analyst.xp, analyst.completed, completedTypes);

  const cert: CertificateData = {
    track,
    recipientName: profile.identity.name || "Nexus Analyst",
    issuedAt: new Date().toLocaleDateString(),
    xp: analyst.xp,
    completedMissions: analyst.completed
  };

  function printCertificate() {
    window.print();
  }

  if (!complete) {
    return (
      <main className="pt-32 px-10 font-mono text-amber-400">
        Track incomplete — keep progressing on {track.title}.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-8 py-16 text-gray-900 print:p-0">
      <article className="mx-auto max-w-3xl border-4 border-double border-gray-800 p-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{track.issuer}</p>
        <h1 className="mt-6 text-4xl font-bold">Certificate of Completion</h1>
        <p className="mt-8 text-lg">This certifies that</p>
        <p className="mt-4 text-3xl font-semibold text-blue-900">{cert.recipientName}</p>
        <p className="mt-8 text-lg">has completed the</p>
        <p className="mt-2 text-2xl font-bold">{track.title}</p>
        <p className="mt-6 text-gray-600">{track.description}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {track.skills.map(skill => (
            <li key={skill} className="rounded border border-gray-300 px-3 py-1">
              {skill}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-gray-500">
          Issued {cert.issuedAt} · {cert.xp} XP · {cert.completedMissions} missions
        </p>
      </article>
      <div className="mx-auto mt-8 max-w-3xl text-center print:hidden">
        <button
          type="button"
          onClick={printCertificate}
          className="border border-gray-800 px-6 py-3 font-mono text-sm"
        >
          Print / Save as PDF
        </button>
      </div>
    </main>
  );
}
