import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function GET(req: Request) {
  const timestamp = new Date().toISOString();
  let database = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = true;
  } catch (error) {
    console.error("[health] Database check failed", error);
  }

  const auditHeader = req.headers.get("x-docker-healthcheck");
  if (auditHeader === "1" && database) {
    void logSecurityEvent({
      eventType: "DOCKER_HEALTH_CHECK",
      severity: "LOW",
      endpoint: "/api/health",
      metadata: { status: "ok", source: "docker" }
    });
  }

  if (!database) {
    return NextResponse.json(
      { status: "degraded", database: false, timestamp },
      { status: 503 }
    );
  }

  return NextResponse.json({ status: "ok", database: true, timestamp });
}
