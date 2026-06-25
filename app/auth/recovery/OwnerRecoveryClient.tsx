"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OwnerRecoveryClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recoveryKey, setRecoveryKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nextKey, setNextKey] = useState("");
  const [busy, setBusy] = useState(false);

  if (status === "loading") {
    return <p className="text-green-400">Checking owner session...</p>;
  }

  if (status === "unauthenticated" || session?.user?.role !== "OWNER") {
    return (
      <div className="space-y-4">
        <p className="text-red-400">Sign in with the configured OWNER Google account first.</p>
        <Link href="/api/auth/signin" className="border border-green-700 px-4 py-2 text-green-300">
          Sign in with Google
        </Link>
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    setNextKey("");

    try {
      const response = await fetch("/api/auth/recovery/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryKey })
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        recoveryKey?: string;
        message?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.error ?? "Recovery failed");
        return;
      }

      setMessage(data.message ?? "MFA reset complete.");
      setNextKey(data.recoveryKey ?? "");
      setRecoveryKey("");
    } catch {
      setError("Recovery request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        Signed in as <span className="text-green-400">{session.user?.email}</span>
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={recoveryKey}
          onChange={event => setRecoveryKey(event.target.value)}
          placeholder="Recovery key"
          className="w-full border border-purple-700 bg-black p-3 text-purple-200 outline-none"
        />
        <button
          type="submit"
          disabled={busy || !recoveryKey.trim()}
          className="border border-green-600 px-5 py-2 text-green-300 disabled:opacity-50"
        >
          {busy ? "Verifying..." : "Reset MFA"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-green-400">{message}</p>}

      {nextKey && (
        <div className="rounded border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-200">
          <p className="font-semibold">New recovery key (shown once):</p>
          <p className="mt-2 break-all font-mono">{nextKey}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/auth/mfa" className="text-cyan-400 hover:underline">
          Back to MFA challenge
        </Link>
        <button
          type="button"
          onClick={() => router.push("/vault/security")}
          className="text-green-400 hover:underline"
        >
          Open Vault Security
        </button>
      </div>
    </div>
  );
}
