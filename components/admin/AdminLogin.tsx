"use client";

import { useState } from "react";

export default function AdminLogin({ success }: { success: () => void }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function unlockLab() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      success();
      return;
    }

    setMessage("LAB UNLOCK DENIED");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-mono">
      <div className="w-96 rounded-xl border border-red-400/30 p-10">
        <h1 className="mb-5 text-xl text-red-400">NEXUS LAB UNLOCK</h1>
        <p className="mb-4 text-xs text-gray-500">
          Simulation-only access. Does not grant Vault, MFA bypass, or owner APIs.
        </p>
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          className="w-full border border-red-400 bg-black p-3"
          placeholder="Lab passphrase"
        />
        <button
          onClick={() => {
            void unlockLab();
          }}
          className="mt-5 block border border-green-400 px-5 py-2"
        >
          UNLOCK LAB
        </button>
        <p className="mt-5 text-sm text-red-400">{message}</p>
      </div>
    </div>
  );
}
