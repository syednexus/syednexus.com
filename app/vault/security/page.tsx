import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import MFASetup from "@/components/security/MFASetup";

export default async function VaultSecurityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/?vault=denied");
  }

  if (session.user.mfaEnabled && !session.user.mfaVerified) {
    redirect("/auth/mfa?callbackUrl=/vault/security");
  }

  return (
    <main className="min-h-screen bg-black p-10 pt-28 font-mono text-green-400">
      <section className="mx-auto max-w-2xl">
        <p className="text-xs text-gray-500">root@nexus:/vault/security#</p>
        <h1 className="mt-4 text-3xl font-bold">Vault Security</h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure TOTP two-factor authentication for Owner access.
        </p>
        <div className="mt-8">
          <MFASetup />
        </div>
      </section>
    </main>
  );
}
