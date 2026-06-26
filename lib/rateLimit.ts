import { logSecurityEvent } from "@/lib/security/securityLogger";
import { getClientIp } from "@/lib/security/requestContext";
import {
  isRedisAvailable,
  redisExpire,
  redisIncrBy,
  redisTtl
} from "@/lib/security/redisClient";

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

async function getRetryAfterSeconds(
  key: string,
  windowMs: number,
  now: number
): Promise<number> {
  try {
    if (await isRedisAvailable()) {
      const ttl = await redisTtl(key);
      if (ttl > 0) {
        return ttl;
      }
    }
  } catch {
    // Fall back to in-memory window below.
  }

  const current = attempts.get(key);
  if (current) {
    return Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  }

  return Math.max(1, Math.ceil(windowMs / 1000));
}

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds?: number;
};

export async function checkRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const ip = getClientIp(req);
  const key = `ratelimit:${scope}:${ip}`;

  let limited = false;
  let backend: "redis" | "memory" = "memory";

  try {
    if (await isRedisAvailable()) {
      backend = "redis";
      limited = await redisRateLimited(key, limit, windowMs);
    } else {
      limited = await memoryRateLimited(key, limit, windowMs, now);
    }
  } catch (error) {
    console.error("[rateLimit] Redis fallback to memory", error);
    limited = await memoryRateLimited(key, limit, windowMs, now);
  }

  if (limited) {
    const retryAfterSeconds = await getRetryAfterSeconds(key, windowMs, now);
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
        backend,
        retryAfterSeconds
      }
    });
    return { limited: true, retryAfterSeconds };
  }

  return { limited: false };
}

export async function isRateLimited(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  return (await checkRateLimit(req, scope, limit, windowMs)).limited;
}
