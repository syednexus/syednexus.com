"use client";

import { useParams, useRouter } from "next/navigation";

import MissionEngine from "@/components/engine/MissionEngine";
import { useMissionBySlug } from "@/hooks/useMissionBySlug";
import { useMissionComplete } from "@/hooks/useMissionComplete";

export default function MissionPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { mission, loading, error } = useMissionBySlug(slug);
  const { answer, setAnswer, result, submitting, completed, debrief, submit } = useMissionComplete(mission);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-6 font-mono text-green-400 sm:p-10">
        <p className="animate-pulse text-gray-500">Loading room...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black p-6 font-mono text-red-400 sm:p-10">
        Failed to load missions: {error}
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="min-h-screen bg-black p-6 font-mono text-red-400 sm:p-10">
        Mission not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 font-mono text-green-400 sm:px-6 sm:py-10 lg:px-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 rounded border border-green-700 px-4 py-2 text-sm transition hover:bg-green-950 sm:mb-8"
      >
        ← BACK
      </button>

      <p className="text-xs uppercase text-blue-400 sm:text-sm">{mission.type}</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{mission.title}</h1>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
        <span>Difficulty: {mission.difficulty}</span>
        <span>XP: {mission.xp}</span>
        <span>{mission.category}</span>
      </div>

      <MissionEngine
        mission={mission}
        answer={answer}
        onAnswerChange={setAnswer}
        onSubmit={() => {
          void submit();
        }}
        result={result}
        submitting={submitting}
        completed={completed}
        debrief={debrief}
      />
    </main>
  );
}
