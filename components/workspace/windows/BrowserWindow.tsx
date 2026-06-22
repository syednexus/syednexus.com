"use client";

import { useMemo, useState } from "react";

import { useWorkstation } from "@/components/workspace/WorkstationContext";
import {
  inferWebMode,
  matchesAcceptPatterns,
  parseLabConfig
} from "@/lib/labConfig";

export default function BrowserWindow() {
  const { mission, layout, completed, submitting, completeLab, addEvidence, trackAction, setProgress } = useWorkstation();
  const config = useMemo(() => parseLabConfig(mission), [mission]);
  const web = config.web;
  const mode = inferWebMode(mission, config);

  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Enter credentials to access Nexus Bank portal.");
  const [url, setUrl] = useState(layout.browserUrl);

  function checkAndComplete(value: string, successMsg: string) {
    const patterns = web?.acceptPatterns;
    if (matchesAcceptPatterns(value, patterns)) {
      setStatus(successMsg);
      addEvidence(`Browser finding: ${value.slice(0, 40)}...`);
      setProgress(current => Math.min(95, current + 25));
      trackAction("browser_payload", value);
      completeLab(value);
      return true;
    }
    return false;
  }

  function handleLogin() {
    const combined = `${username} ${password}`;
    if (
      checkAndComplete(
        combined,
        web?.successOutput ?? config.sqliSuccess ?? "Login bypass successful — SQL injection confirmed."
      )
    ) {
      return;
    }
    trackAction("browser_payload", `${username} ${password}`);
    setStatus("ACCESS DENIED — invalid credentials.");
  }

  const showLogin = mode === "login" || mission.type === "WEB_ATTACK" || !web?.mode;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2 border-b border-green-900/30 pb-2">
        <span className="text-gray-600">URL</span>
        <input
          value={url}
          onChange={event => setUrl(event.target.value)}
          className="min-w-0 flex-1 border border-green-900/40 bg-black/40 px-2 py-1 text-xs text-cyan-400 outline-none"
        />
      </div>

      <div className="flex-1 rounded border border-green-900/30 bg-gradient-to-b from-slate-900/80 to-black p-4">
        <h2 className="text-lg font-bold text-white">{layout.browserTitle}</h2>
        <p className="mt-1 text-xs text-gray-500">Secure Online Banking — Training Environment</p>

        {showLogin && (
          <div className="mt-6 max-w-xs space-y-3">
            <label className="block text-xs text-gray-500">
              Username
              <input
                value={username}
                onChange={event => setUsername(event.target.value)}
                disabled={completed || submitting}
                className="mt-1 w-full border border-green-800 bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            <label className="block text-xs text-gray-500">
              Password
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                disabled={completed || submitting}
                className="mt-1 w-full border border-green-800 bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleLogin}
              disabled={completed || submitting}
              className="w-full border border-green-600 py-2 text-sm text-green-400 hover:bg-green-950"
            >
              Sign In
            </button>
          </div>
        )}

        <p className={`mt-4 text-xs ${status.includes("DENIED") ? "text-red-400" : "text-gray-400"}`}>{status}</p>
      </div>
    </div>
  );
}
