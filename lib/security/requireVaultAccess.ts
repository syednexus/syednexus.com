import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import { authOptions } from "@/auth";

export type VaultAccessSession = {
  email: string;
  role: "OWNER";
  mfaEnabled: boolean;
  mfaVerified: boolean;
};

function isVaultUnlocked(mfaEnabled: boolean, mfaVerified: boolean): boolean {
  if (!mfaEnabled) return true;
  return mfaVerified === true;
}

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

  const mfaEnabled = Boolean(token?.mfaEnabled ?? session.user.mfaEnabled);
  const mfaVerified = Boolean(token?.mfaVerified ?? session.user.mfaVerified);

  if (!isVaultUnlocked(mfaEnabled, mfaVerified)) {
    return null;
  }

  return {
    email: session.user.email,
    role: "OWNER",
    mfaEnabled,
    mfaVerified
  };
}

export async function requireOwner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return null;
  }

  if (session.user.mfaEnabled && !session.user.mfaVerified) {
    return null;
  }

  return session;
}

export function vaultAccessDeniedReason(
  role: string | undefined,
  mfaEnabled?: boolean,
  mfaVerified?: boolean
): "auth" | "mfa" | null {
  if (role !== "OWNER") return "auth";
  if (mfaEnabled && !mfaVerified) return "mfa";
  return null;
}
