"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type SetupPayload = {
  qrDataUrl: string;
  manualEntry: string;
  message: string;
};

export default function MFASetup() {
  const { update } = useSession();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState<SetupPayload | null>(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/mfa/status");
      if (!response.ok) throw new Error("status");
      const data = (await response.json()) as { mfaEnabled: boolean };
      setMfaEnabled(data.mfaEnabled);
    } catch {
      setError("Could not load MFA status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function startSetup() {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/mfa/setup", { method: "POST" });
      const data = (await response.json()) as SetupPayload & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Setup failed");
        return;
      }
      setSetup(data);
      setMessage(data.message);
    } catch {
      setError("Setup request failed");
    } finally {
      setBusy(false);
    }
  }

  async function activateMfa(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/mfa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Invalid code");
        return;
      }
      await update({ mfaEnabled: true, mfaVerified: true });
      setSetup(null);
      setToken("");
      setMfaEnabled(true);
      setMessage("MFA is active. You will need your authenticator on future Vault logins.");
    } catch {
      setError("Activation failed");
    } finally {
      setBusy(false);
    }
  }

  async function disableMfa(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Invalid code");
        return;
      }
      await update({ mfaEnabled: false, mfaVerified: true });
      setMfaEnabled(false);
      setToken("");
      setMessage("MFA disabled.");
    } catch {
      setError("Disable failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading security settings…</p>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="rounded border border-green-900/40 bg-black/40 p-4">
        <p className="text-xs uppercase text-gray-600">Two-factor authentication</p>
        <p className="mt-2 text-green-300">
          Status: {mfaEnabled ? "Enabled" : "Disabled"}
        </p>
        <p className="mt-2 text-gray-500">
          Compatible with Google Authenticator, Microsoft Authenticator, and Authy.
        </p>
      </div>

      {message && <p className="text-cyan-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!mfaEnabled && !setup && (
        <button
          type="button"
          onClick={startSetup}
          disabled={busy}
          className="border border-green-600 px-4 py-2 text-green-300 hover:bg-green-950 disabled:opacity-50"
        >
          Set up authenticator
        </button>
      )}

      {!mfaEnabled && setup && (
        <div className="space-y-4 rounded border border-cyan-900/40 bg-cyan-950/10 p-4">
          <p className="text-cyan-400">Scan this QR code with your authenticator app</p>
          <Image
            src={setup.qrDataUrl}
            alt="MFA QR code"
            width={200}
            height={200}
            unoptimized
            className="rounded border border-cyan-900/30 bg-white p-2"
          />
          <p className="text-xs text-gray-600">
            Manual entry key (shown once):{" "}
            <span className="break-all font-mono text-cyan-500">{setup.manualEntry}</span>
          </p>
          <form onSubmit={activateMfa} className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="text-gray-600">6-digit code</span>
              <input
                value={token}
                onChange={event => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 block border border-green-800 bg-black px-3 py-2 font-mono text-green-300 outline-none"
                inputMode="numeric"
              />
            </label>
            <button
              type="submit"
              disabled={busy || token.length !== 6}
              className="border border-green-600 px-4 py-2 text-green-300 disabled:opacity-50"
            >
              Activate MFA
            </button>
          </form>
        </div>
      )}

      {mfaEnabled && (
        <form onSubmit={disableMfa} className="space-y-3 rounded border border-red-900/30 p-4">
          <p className="text-red-300">Disable MFA (requires current authenticator code)</p>
          <input
            value={token}
            onChange={event => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="block border border-red-900/40 bg-black px-3 py-2 font-mono text-red-200 outline-none"
            inputMode="numeric"
            placeholder="000000"
          />
          <button
            type="submit"
            disabled={busy || token.length !== 6}
            className="border border-red-700 px-4 py-2 text-red-300 disabled:opacity-50"
          >
            Disable MFA
          </button>
        </form>
      )}
    </div>
  );
}
