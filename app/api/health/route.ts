import { NextResponse } from "next/server";

import { logSecurityEvent } from "@/lib/security/securityLogger";
import { buildPlatformHealthPayload } from "@/lib/security/platformHealth";

export async function GET(req: Request) {
  const payload = await buildPlatformHealthPayload(req);
  const dockerProbe = payload.signals.dockerProbe;

  if (dockerProbe && payload.database) {
    void logSecurityEvent({
      eventType: "DOCKER_HEALTH_CHECK",
      severity: "LOW",
      endpoint: "/api/health",
      metadata: { status: payload.status, source: "docker" }
    });
  }

  if (!payload.database || payload.redis === "unavailable") {
    void logSecurityEvent({
      eventType: "HEALTH_CHECK",
      severity: payload.database ? "MEDIUM" : "HIGH",
      endpoint: "/api/health",
      metadata: {
        status: payload.status,
        database: payload.database,
        redis: payload.redis,
        rls: payload.rls,
        environment: payload.environment,
        dockerProbe
      }
    });
  }

  if (!payload.database) {
    return NextResponse.json(payload, { status: 503 });
  }

  return NextResponse.json(payload);
}
