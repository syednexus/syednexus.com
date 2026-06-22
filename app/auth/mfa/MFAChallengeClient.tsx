"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export default function MFAChallengeClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/vault";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectIfReady = useCallback(() => {
    if (session?.user?.role !== "OWNER") {
      router.replace("/?vault=denied");
      return;
    }
    if (!shouldRequireMfaChallenge(session.user)) {
      router.replace(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    if (status === "authenticated") {
      redirectIfReady();
    }
  }, [status, redirectIfReady, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }

      await update({ mfaVerified: true });
      router.replace(callbackUrl);
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-mono text-green-400">
        <p>Verifying session…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 font-mono text-green-400">
      <section className="w-full max-w-md rounded-xl border border-green-900/50 bg-green-950/10 p-8">
        <p className="text-xs uppercase tracking-widest text-gray-600">Vault access</p>
        <h1 className="mt-2 text-2xl font-bold text-green-300">Authenticator required</h1>
        <p className="mt-3 text-sm text-gray-500">
          Enter the 6-digit code from your authenticator app to unlock the Vault.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            value={token}
            onChange={event => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="w-full border border-green-800 bg-black px-4 py-3 text-center text-2xl tracking-[0.4em] text-green-300 outline-none"
            disabled={submitting}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting || token.length !== 6}
            className="w-full border border-green-600 py-3 text-green-300 hover:bg-green-950 disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Unlock Vault"}
          </button>
        </form>
      </section>
    </main>
  );
}
