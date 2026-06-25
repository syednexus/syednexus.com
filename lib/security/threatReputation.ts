import { logSecurityEvent, type SecurityEventInput } from "@/lib/security/securityLogger";
import {
  isRedisAvailable,
  redisExpire,
  redisGet,
  redisIncrBy,
  redisSet,
  threatReputationKey
} from "@/lib/security/redisClient";

const REPUTATION_TTL_SECONDS = 24 * 60 * 60;
const THREAT_THRESHOLD = 100;

const EVENT_REPUTATION_DELTA: Partial<Record<string, number>> = {
  LOGIN_FAILED: 10,
  MFA_FAILED: 20,
  API_FORBIDDEN: 15
};

const SUDO_DENIED_DELTA = 30;

export async function recordThreatReputation(event: SecurityEventInput): Promise<void> {
  const ip = event.ipAddress?.trim();
  if (!ip || ip === "unknown") return;

  let delta = EVENT_REPUTATION_DELTA[event.eventType] ?? 0;

  if (event.eventType === "SUDO_ATTEMPT") {
    const metadata = event.metadata ?? {};
    const success = metadata.success === true;
    const reason = typeof metadata.reason === "string" ? metadata.reason : "";
    if (!success || reason === "denied") {
      delta = SUDO_DENIED_DELTA;
    }
  }

  if (delta <= 0) return;

  if (!(await isRedisAvailable())) {
    return;
  }

  const key = threatReputationKey(ip);

  try {
    const currentScore = await redisIncrBy(key, delta);
    if (currentScore === delta) {
      await redisExpire(key, REPUTATION_TTL_SECONDS);
    }

    if (currentScore > THREAT_THRESHOLD) {
      const flagKey = `${key}:alerted`;
      const alreadyAlerted = await redisGet(flagKey);
      if (alreadyAlerted) return;

      await redisSet(flagKey, "1", REPUTATION_TTL_SECONDS);

      await logSecurityEvent(
        {
          eventType: "THREAT_THRESHOLD_REACHED",
          severity: "CRITICAL",
          ipAddress: ip,
          userEmail: event.userEmail ?? null,
          userAgent: event.userAgent ?? null,
          endpoint: event.endpoint ?? null,
          metadata: {
            reputationScore: currentScore,
            threshold: THREAT_THRESHOLD,
            triggerEvent: event.eventType
          }
        },
        { skipDetection: true }
      );

      await logSecurityEvent(
        {
          eventType: "THREAT_THRESHOLD",
          severity: "CRITICAL",
          ipAddress: ip,
          userEmail: event.userEmail ?? null,
          endpoint: event.endpoint ?? null,
          metadata: {
            reputationScore: currentScore,
            source: "redis_reputation"
          }
        },
        { skipDetection: true }
      );
    }
  } catch (error) {
    console.error("[threatReputation] Redis update failed", error);
  }
}
