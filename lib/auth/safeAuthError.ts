/** NextAuth + app error codes safe for URLs and HTTP headers (ASCII only). */
export const AUTH_ERROR_CODES = [
  "Default",
  "Configuration",
  "AccessDenied",
  "Verification",
  "DatabaseUnavailable"
] as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

export function sanitizeAuthErrorCode(raw: string | undefined | null): AuthErrorCode {
  if (!raw) return "Default";

  const trimmed = raw.trim();

  if ((AUTH_ERROR_CODES as readonly string[]).includes(trimmed)) {
    return trimmed as AuthErrorCode;
  }

  // Reject long or non-Latin-1 payloads (Prisma stack traces, unicode arrows, etc.)
  if (trimmed.length > 80 || /[^\x20-\x7E]/.test(trimmed)) {
    if (/database|credentials|prisma|postgres|P1000|P1001/i.test(trimmed)) {
      return "DatabaseUnavailable";
    }
    return "Default";
  }

  if (/database|credentials|prisma|postgres|authentication failed/i.test(trimmed)) {
    return "DatabaseUnavailable";
  }

  return "Default";
}

export function authErrorPagePath(code: AuthErrorCode): string {
  return `/auth/error?error=${encodeURIComponent(code)}`;
}
