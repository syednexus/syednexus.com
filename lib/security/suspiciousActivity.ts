import { prisma } from "@/lib/prisma";

import {
  logSecurityEvent,
  type SecurityEventInput,
  type SecuritySeverity
} from "@/lib/security/securityLogger";

type AlertRule = {
  rule: string;
  severity: SecuritySeverity;
  message: string;
};

async function countRecentEvents(
  eventType: SecurityEventInput["eventType"],
  since: Date,
  filters?: { ipAddress?: string | null; userEmail?: string | null }
): Promise<number> {
  return prisma.securityLog.count({
    where: {
      eventType,
      createdAt: { gte: since },
      ...(filters?.ipAddress ? { ipAddress: filters.ipAddress } : {}),
      ...(filters?.userEmail ? { userEmail: filters.userEmail } : {})
    }
  });
}

async function raiseAlert(
  source: SecurityEventInput,
  alert: AlertRule,
  count: number
): Promise<void> {
  const recentAlerts = await prisma.securityLog.findMany({
    where: {
      eventType: source.eventType,
      severity: alert.severity,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      ...(source.ipAddress ? { ipAddress: source.ipAddress } : {})
    },
    select: { metadata: true },
    take: 20
  });

  const alreadyLogged = recentAlerts.some(row => {
    const metadata = row.metadata as Record<string, unknown> | null;
    return metadata?.alertRule === alert.rule;
  });

  if (alreadyLogged) {
    return;
  }

  await logSecurityEvent(
    {
      eventType: source.eventType,
      severity: alert.severity,
      userEmail: source.userEmail,
      ipAddress: source.ipAddress,
      userAgent: source.userAgent,
      endpoint: source.endpoint,
      metadata: {
        alert: true,
        alertRule: alert.rule,
        message: alert.message,
        count
      }
    },
    { skipDetection: true }
  );
}

export async function evaluateSuspiciousActivity(event: SecurityEventInput): Promise<void> {
  const now = Date.now();

  if (event.eventType === "LOGIN_FAILED") {
    const count = await countRecentEvents("LOGIN_FAILED", new Date(now - 15 * 60 * 1000), {
      ipAddress: event.ipAddress
    });

    if (count >= 8) {
      await raiseAlert(event, {
        rule: "login_brute_force",
        severity: "HIGH",
        message: "Eight or more failed logins within fifteen minutes"
      }, count);
    }
  }

  if (event.eventType === "MFA_FAILED") {
    const count = await countRecentEvents("MFA_FAILED", new Date(now - 10 * 60 * 1000), {
      ipAddress: event.ipAddress
    });

    if (count >= 5) {
      await raiseAlert(event, {
        rule: "mfa_brute_force",
        severity: "HIGH",
        message: "Five or more MFA failures within ten minutes"
      }, count);
    }
  }

  if (event.eventType === "API_FORBIDDEN") {
    const count = await countRecentEvents("API_FORBIDDEN", new Date(now - 5 * 60 * 1000), {
      ipAddress: event.ipAddress
    });

    if (count >= 10) {
      await raiseAlert(event, {
        rule: "api_probe",
        severity: "CRITICAL",
        message: "Ten or more forbidden API attempts within five minutes"
      }, count);
    }
  }

  if (event.eventType === "RECOVERY_USED") {
    const count = await countRecentEvents("RECOVERY_USED", new Date(now - 60 * 60 * 1000), {
      userEmail: event.userEmail
    });

    if (count >= 2) {
      await raiseAlert(event, {
        rule: "recovery_abuse",
        severity: "CRITICAL",
        message: "Multiple recovery attempts within one hour"
      }, count);
    }
  }
}
