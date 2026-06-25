import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import { authOptions } from "@/auth";
import { logApiForbidden } from "@/lib/security/securityLogger";
import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export type VaultAccessSession = {
  email: string;
  role: "OWNER";
  mfaEnabled: boolean;
  mfaVerified: boolean;
};

export async function getVaultAccess(
  req?: Request | NextRequest
): Promise<VaultAccessSession | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || session.user.role !== "OWNER") {
    if (req) {
      await logApiForbidden(req, email ?? null, "owner_required");
    }
    return null;
  }

  const token = req
    ? await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET })
    : null;

  const mfaToken = token ?? session.user;

  if (shouldRequireMfaChallenge(mfaToken)) {
    if (req) {
      await logApiForbidden(req, email, "mfa_required");
    }
    return null;
  }

  return {
    email,
    role: "OWNER",
    mfaEnabled: Boolean(mfaToken.mfaEnabled),
    mfaVerified: Boolean(mfaToken.mfaVerified)
  };
}

export async function requireOwner(req?: Request) {
  const session = await getServerSession(authOptions);

  const token =
    req != null
      ? await getToken({
          req: req as NextRequest,
          secret: process.env.NEXTAUTH_SECRET
        })
      : null;

  const email = session?.user?.email ?? (typeof token?.email === "string" ? token.email : null);
  const role = session?.user?.role ?? (typeof token?.role === "string" ? token.role : undefined);

  if (!email || role !== "OWNER") {
    if (req) {
      await logApiForbidden(req, email, "owner_required");
    }
    return null;
  }

  const mfaSource = token ?? session?.user ?? {};

  if (shouldRequireMfaChallenge(mfaSource)) {
    if (req) {
      await logApiForbidden(req, email, "mfa_required");
    }
    return null;
  }

  if (session?.user?.email && session.user.role === "OWNER") {
    return session;
  }

  return {
    user: {
      email,
      name: typeof token?.name === "string" ? token.name : email,
      role: "OWNER" as const,
      mfaEnabled: Boolean(mfaSource.mfaEnabled),
      mfaVerified: Boolean(mfaSource.mfaVerified),
      mfaVerifiedAt:
        typeof mfaSource.mfaVerifiedAt === "number" ? mfaSource.mfaVerifiedAt : undefined,
      lastActivityAt:
        typeof mfaSource.lastActivityAt === "number" ? mfaSource.lastActivityAt : undefined
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
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
