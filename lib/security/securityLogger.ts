import { Prisma } from "@/lib/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import {
  SECURITY_EVENT_TYPES,
  SECURITY_SEVERITIES,
  type SecurityEventType,
  type SecuritySeverity
} from "@/lib/security/securityEvents";
import { evaluateSuspiciousActivity } from "@/lib/security/suspiciousActivity";
import {
  isSecurityLogStorageReady,
  resetSecurityLogStorageCache
} from "@/lib/security/securityLogStorage";

export {
  SECURITY_EVENT_TYPES,
  SECURITY_SEVERITIES,
  type SecurityEventType,
  type SecuritySeverity
} from "@/lib/security/securityEvents";

export type SecurityEventInput = {
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  endpoint?: string | null;
  metadata?: Record<string, unknown> | null;
};

const SENSITIVE_KEY_PATTERN =
  /(password|passwd|token|secret|cookie|authorization|mfa|otp|totp|code|recoverykey|apikey|api_key|credential)/i;

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    if (value.length > 500) {
      return `${value.slice(0, 500)}…`;
    }
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map(item => sanitizeValue(item));
  }

  if (typeof value === "object") {
    return sanitizeMetadata(value as Record<string, unknown>);
  }

  return String(value);
}

export function sanitizeMetadata(
  metadata: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
}

export async function logSecurityEvent(
  input: SecurityEventInput,
  options?: { skipDetection?: boolean }
): Promise<boolean> {
  try {
    if (!(await isSecurityLogStorageReady())) {
      return false;
    }

    const metadata =
      input.metadata && Object.keys(input.metadata).length > 0
        ? (sanitizeMetadata(input.metadata) as Prisma.InputJsonValue)
        : undefined;

    await prisma.securityLog.create({
      data: {
        eventType: input.eventType,
        severity: input.severity,
        userEmail: input.userEmail ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        endpoint: input.endpoint ?? null,
        metadata
      }
    });

    if (!options?.skipDetection) {
      try {
        await evaluateSuspiciousActivity(input);
      } catch (detectionError) {
        console.error("[securityLogger] Suspicious activity check failed", detectionError);
      }
    }

    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      String(error.code) === "P2021"
    ) {
      resetSecurityLogStorageCache();
    }
    console.error("[securityLogger] Failed to persist security event", error);
    return false;
  }
}

export async function logApiForbidden(
  req: Request,
  userEmail: string | null | undefined,
  reason: string
): Promise<void> {
  const url = new URL(req.url);

  await logSecurityEvent({
    eventType: "API_FORBIDDEN",
    severity: "MEDIUM",
    userEmail: userEmail ?? null,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown",
    userAgent: req.headers.get("user-agent"),
    endpoint: url.pathname,
    metadata: {
      method: req.method,
      reason
    }
  });
}
