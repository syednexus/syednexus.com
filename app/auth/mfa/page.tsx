import { Suspense } from "react";

import MFAChallengeClient from "./MFAChallengeClient";

export default function MFAChallengePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black font-mono text-green-400">
          <p>Loading…</p>
        </main>
      }
    >
      <MFAChallengeClient />
    </Suspense>
  );
}
