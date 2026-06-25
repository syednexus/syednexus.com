import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import VaultActivityPing from "@/components/security/VaultActivityPing";

export default async function VaultLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.role === "OWNER";

  return (
    <>
      <VaultActivityPing />

      <div className="fixed left-2 right-2 top-24 z-40 flex flex-wrap gap-2 sm:left-5 sm:right-auto">
        <Link
          href="/vault"
          className="rounded border border-green-600 bg-black px-4 py-2 font-mono text-sm text-green-400 transition hover:bg-green-950"
        >
          ← Vault
        </Link>

        {isOwner && (
          <Link
            href="/vault/security"
            className="rounded border border-amber-600 bg-black px-4 py-2 font-mono text-sm text-amber-400 transition hover:bg-amber-950"
          >
            Security Center
          </Link>
        )}

        <Link
          href="/vault/admin"
          className="rounded border border-blue-600 bg-black px-4 py-2 font-mono text-sm text-blue-400 transition hover:bg-blue-950"
        >
          Admin
        </Link>

        <Link
          href="/"
          className="rounded border border-gray-600 bg-black px-4 py-2 font-mono text-sm text-gray-300 transition hover:bg-gray-900"
        >
          Home
        </Link>
      </div>

      <div className="pt-16">{children}</div>
    </>
  );
}
