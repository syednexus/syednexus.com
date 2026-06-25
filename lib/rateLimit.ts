import { logSecurityEvent } from "@/lib/security/securityLogger";
import { getClientIp } from "@/lib/security/requestContext";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

export function getClientIpFromRequest(req: Request): string {
  return getClientIp(req);
}

export function isRateLimited(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;

  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return false;
  }

  current.count += 1;

  if (current.count > limit) {
    void logSecurityEvent({
      eventType: "RATE_LIMIT_TRIGGERED",
      severity: "HIGH",
      ipAddress: ip,
      userAgent: req.headers.get("user-agent"),
      endpoint: new URL(req.url).pathname,
      metadata: {
        scope,
        attemptCount: current.count,
        limit,
        windowMs
      }
    });

    return true;
  }

  attempts.set(key, current);

  return false;
}
