import { logSecurityEvent } from "@/lib/security/securityLogger";
import { getClientIp } from "@/lib/security/requestContext";
import { isRedisAvailable, redisExpire, redisGet, redisIncrBy, redisSet, threatReputationKey } from "@/lib/security/redisClient";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

export function getClientIpFromRequest(req: Request): string {
  return getClientIp(req);
}

async function memoryRateLimited(
  key: string,
  limit: number,
  windowMs: number,
  now: number
): Promise<boolean> {
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
    return true;
  }

  attempts.set(key, current);
  return false;
}

async function redisRateLimited(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const count = await redisIncrBy(key, 1);
  if (count === 1) {
    await redisExpire(key, Math.ceil(windowMs / 1000));
  }
  return count > limit;
}

export async function isRateLimited(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  const ip = getClientIp(req);
  const key = `ratelimit:${scope}:${ip}`;

  let limited = false;

  try {
    if (await isRedisAvailable()) {
      limited = await redisRateLimited(key, limit, windowMs);
    } else {
      limited = await memoryRateLimited(key, limit, windowMs, now);
    }
  } catch (error) {
    console.error("[rateLimit] Redis fallback to memory", error);
    limited = await memoryRateLimited(key, limit, windowMs, now);
  }

  if (limited) {
    void logSecurityEvent({
      eventType: "RATE_LIMIT_TRIGGERED",
      severity: "HIGH",
      ipAddress: ip,
      userAgent: req.headers.get("user-agent"),
      endpoint: new URL(req.url).pathname,
      metadata: {
        scope,
        limit,
        windowMs,
        backend: (await isRedisAvailable()) ? "redis" : "memory"
      }
    });
  }

  return limited;
}
