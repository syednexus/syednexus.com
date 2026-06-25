import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyStoredTotp } from "@/lib/security/totp";
import { getVaultAccess } from "@/lib/security/requireVaultAccess";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (await isRateLimited(req, "mfa:disable", 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts — wait 15 minutes" }, { status: 429 });
  }

  if (!(await getVaultAccess(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { token?: string };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { mfaSecret: true }
  });

  if (!user?.mfaSecret || !verifyStoredTotp(user.mfaSecret, token)) {
    void logSecurityEvent({
      eventType: "MFA_FAILED",
      severity: "MEDIUM",
      userEmail: session.user.email,
      ...getRequestSecurityContext(req),
      metadata: { reason: "invalid_totp", action: "disable" }
    });

    return NextResponse.json({ error: "Invalid authenticator code" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { mfaEnabled: false, mfaSecret: null }
  });

  void logSecurityEvent({
    eventType: "MFA_RESET",
    severity: "HIGH",
    userEmail: session.user.email,
    ...getRequestSecurityContext(req),
    metadata: { source: "owner_disable" }
  });

  return NextResponse.json({ success: true, mfaEnabled: false });
}
