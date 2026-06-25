export type OwnerSessionUser = {
  role?: string;
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
};

export function isOwnerRole(role: string | undefined): boolean {
  return role === "OWNER";
}

/** Google OWNER with MFA satisfied (or MFA not yet enabled). */
export function isOwnerSessionComplete(user: OwnerSessionUser | null | undefined): boolean {
  if (!isOwnerRole(user?.role)) {
    return false;
  }

  if (user?.mfaEnabled && !user?.mfaVerified) {
    return false;
  }

  return true;
}

export type OwnerSudoGate =
  | { status: "signin" }
  | { status: "denied" }
  | { status: "mfa" }
  | { status: "granted" };

export function resolveOwnerSudoGate(
  user: OwnerSessionUser | null | undefined,
  authenticated: boolean
): OwnerSudoGate {
  if (!authenticated || !user) {
    return { status: "signin" };
  }

  if (!isOwnerRole(user.role)) {
    return { status: "denied" };
  }

  if (user.mfaEnabled && !user.mfaVerified) {
    return { status: "mfa" };
  }

  return { status: "granted" };
}
