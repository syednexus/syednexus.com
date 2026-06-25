import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVaultAccess } from "@/lib/security/requireVaultAccess";
import { verifyStoredTotp } from "@/lib/security/totp";
import { generateMfaProof } from "@/lib/security/mfaProof";
import { isRateLimited } from "@/lib/rateLimit";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  // Rate limit: 5 attempts per 15 minutes per IP
  if (isRateLimited(req, "mfa:enable", 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts — wait 15 minutes" },
      { status: 429 }
    );
  }

  if (!(await getVaultAccess(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { token?: string };
  const code = typeof body.token === "string" ? body.token.trim() : "";
  if (!code) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { mfaSecret: true }
  });

  if (!user?.mfaSecret || !verifyStoredTotp(user.mfaSecret, code)) {
    void logSecurityEvent({
      eventType: "MFA_FAILED",
      severity: "MEDIUM",
      userEmail: session.user.email,
      ...getRequestSecurityContext(req),
      metadata: { reason: "invalid_totp", action: "enable" }
    });

    return NextResponse.json({ error: "Invalid authenticator code" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { mfaEnabled: true }
  });

  const verifiedAt = Date.now();
  const mfaProof = generateMfaProof(
    session.user.email.trim().toLowerCase(),
    "enable",
    verifiedAt
  );

  void logSecurityEvent({
    eventType: "MFA_SUCCESS",
    severity: "LOW",
    userEmail: session.user.email,
    ...getRequestSecurityContext(req),
    metadata: { action: "enable" }
  });

  return NextResponse.json({ success: true, mfaEnabled: true, mfaProof, verifiedAt });
}
