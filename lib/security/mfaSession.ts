export const INACTIVITY_MS = 2 * 60 * 60 * 1000;
export const MAX_ACTIVE_MS = 12 * 60 * 60 * 1000;

export type MfaSessionToken = {
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
  mfaVerifiedAt?: number;
  lastActivityAt?: number;
};

export function isMfaTrustValid(token: MfaSessionToken): boolean {
  if (!token.mfaEnabled) return true;
  if (!token.mfaVerified) return false;

  const verifiedAt = token.mfaVerifiedAt;
  if (typeof verifiedAt !== "number" || verifiedAt <= 0) return false;

  const now = Date.now();
  const lastActivity = token.lastActivityAt ?? verifiedAt;

  if (now - verifiedAt > MAX_ACTIVE_MS) return false;
  if (now - lastActivity > INACTIVITY_MS) return false;

  return true;
}

export function shouldRequireMfaChallenge(token: MfaSessionToken): boolean {
  if (!token.mfaEnabled) return false;
  if (!token.mfaVerified) return true;
  return !isMfaTrustValid(token);
}
