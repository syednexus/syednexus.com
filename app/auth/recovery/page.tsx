import OwnerRecoveryClient from "./OwnerRecoveryClient";

export default function OwnerRecoveryPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 font-mono text-green-400">
      <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-purple-900/40 bg-purple-950/10 p-8">
        <p className="text-xs uppercase tracking-widest text-purple-400">Owner Recovery</p>
        <h1 className="text-2xl text-purple-200">Reset MFA with recovery key</h1>
        <p className="text-sm text-gray-400">
          Requires Google OWNER login plus your one-time recovery key. Password-only recovery is
          disabled.
        </p>
        <OwnerRecoveryClient />
      </div>
    </main>
  );
}
