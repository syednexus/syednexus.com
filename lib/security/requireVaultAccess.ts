import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import { authOptions } from "@/auth";
import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export type VaultAccessSession = {
  email: string;
  role: "OWNER";
  mfaEnabled: boolean;
  mfaVerified: boolean;
};

export async function getVaultAccess(
  req?: NextRequest
): Promise<VaultAccessSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return null;
  }

  const token = req
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : null;

  const mfaToken = token ?? session.user;

  if (shouldRequireMfaChallenge(mfaToken)) {
    return null;
  }

  return {
    email: session.user.email,
    role: "OWNER",
    mfaEnabled: Boolean(mfaToken.mfaEnabled),
    mfaVerified: Boolean(mfaToken.mfaVerified)
  };
}

export async function requireOwner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return null;
  }

  if (shouldRequireMfaChallenge(session.user)) {
    return null;
  }

  return session;
}

export function vaultAccessDeniedReason(
  role: string | undefined,
  mfaEnabled?: boolean,
  mfaVerified?: boolean,
  mfaVerifiedAt?: number,
  lastActivityAt?: number
): "auth" | "mfa" | null {
  if (role !== "OWNER") return "auth";
  if (
    shouldRequireMfaChallenge({
      mfaEnabled,
      mfaVerified,
      mfaVerifiedAt,
      lastActivityAt
    })
  ) {
    return "mfa";
  }
  return null;
}
