import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import MFASetup from "@/components/security/MFASetup";
import SecurityDashboard from "@/components/security/SecurityDashboard";
import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export default async function VaultSecurityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/?vault=denied");
  }

  if (shouldRequireMfaChallenge(session.user)) {
    redirect("/auth/mfa?callbackUrl=/vault/security");
  }

  return (
    <main className="min-h-screen bg-black p-10 pt-28 font-mono text-green-400">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs text-gray-500">root@nexus:/vault/security#</p>
        <h1 className="mt-4 text-3xl font-bold">Vault Security</h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure TOTP two-factor authentication and review security audit telemetry.
        </p>
        <div className="mt-8">
          <MFASetup />
        </div>
        <SecurityDashboard />
      </section>
    </main>
  );
}
