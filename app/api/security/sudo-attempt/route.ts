import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { resolveOwnerSudoGate } from "@/lib/auth/ownerAccess";
import { isRateLimited } from "@/lib/rateLimit";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  if (await isRateLimited(req, "security:sudo-attempt", 30, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many sudo audit requests" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  const context = getRequestSecurityContext(req);

  let body: { command?: unknown; success?: unknown; reason?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const command = typeof body.command === "string" ? body.command : "unknown";
  const clientSuccess = body.success === true;
  const clientReason = typeof body.reason === "string" ? body.reason : "unknown";

  const gate = resolveOwnerSudoGate(session?.user, Boolean(session?.user?.email));
  const serverGranted = gate.status === "granted";

  if (clientSuccess !== serverGranted) {
    return NextResponse.json({ error: "Invalid sudo audit payload" }, { status: 400 });
  }

  let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  if (serverGranted) {
    severity = "LOW";
  } else if (gate.status === "denied") {
    severity = "HIGH";
  } else if (gate.status === "signin") {
    severity = "MEDIUM";
  } else if (gate.status === "mfa") {
    severity = "MEDIUM";
  }

  await logSecurityEvent({
    eventType: "SUDO_ATTEMPT",
    severity,
    userEmail: session?.user?.email ?? null,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    endpoint: context.endpoint,
    metadata: {
      command,
      success: serverGranted,
      reason: serverGranted ? "owner_session_verified" : gate.status,
      clientReason
    }
  });

  return NextResponse.json({ logged: true });
}
