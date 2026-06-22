"use client";

import Link from "next/link";

export default function AiLabPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 font-mono text-green-400 sm:px-8 sm:py-20">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-widest text-purple-400">AI Security Lab</p>

        <h1 className="mt-4 text-4xl font-bold text-purple-300 sm:text-5xl">NEXUS AI SECURITY</h1>

        <p className="mt-5 text-sm text-gray-400 sm:text-base">
          Educational AI security range — prompt injection awareness, LLM threat modeling, and safe
          adversarial testing in simulated environments. No live model exploitation against real
          systems.
        </p>

        <div className="mt-10 space-y-4 rounded-xl border border-purple-900/60 bg-purple-950/10 p-6">
          <h2 className="text-lg text-purple-300">Lab Areas</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Prompt injection simulation</li>
            <li>• LLM output validation exercises</li>
            <li>• AI supply chain risk scenarios</li>
            <li>• Red-team vs blue-team AI incident response</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/nexus"
            className="border border-green-600 px-5 py-3 text-green-400 hover:bg-green-950"
          >
            ← Nexus OS
          </Link>
          <Link
            href="/soc"
            className="border border-blue-600 px-5 py-3 text-blue-400 hover:bg-blue-950"
          >
            SOC Simulator
          </Link>
          <p className="self-center text-xs text-gray-600">
            Tip: type <span className="text-green-500">ai &lt;message&gt;</span> in the Nexus terminal for AI chat
          </p>
        </div>
      </section>
    </main>
  );
}
