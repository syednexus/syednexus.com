import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyStoredTotp } from "@/lib/security/totp";
import { generateMfaProof } from "@/lib/security/mfaProof";
import { isRateLimited } from "@/lib/rateLimit";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  const context = getRequestSecurityContext(req);

  if (await isRateLimited(req, "mfa:verify", 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts — wait 15 minutes" },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    void logSecurityEvent({
      eventType: "OWNER_ACCESS_DENIED",
      severity: "HIGH",
      userEmail: session?.user?.email ?? null,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: { reason: "mfa_verify_non_owner" }
    });

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { token?: string };
  const code = typeof body.token === "string" ? body.token.trim() : "";
  if (!code) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { mfaEnabled: true, mfaSecret: true }
  });

  if (!user?.mfaEnabled || !user.mfaSecret) {
    return NextResponse.json({ error: "MFA not enabled" }, { status: 400 });
  }

  if (!verifyStoredTotp(user.mfaSecret, code)) {
    void logSecurityEvent({
      eventType: "MFA_FAILED",
      severity: "MEDIUM",
      userEmail: session.user.email,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: { reason: "invalid_totp" }
    });

    return NextResponse.json({ error: "Invalid authenticator code" }, { status: 401 });
  }

  const verifiedAt = Date.now();
  const mfaProof = generateMfaProof(
    session.user.email.trim().toLowerCase(),
    "verify",
    verifiedAt
  );

  void logSecurityEvent({
    eventType: "MFA_SUCCESS",
    severity: "LOW",
    userEmail: session.user.email,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    endpoint: context.endpoint,
    metadata: { action: "verify" }
  });

  void logSecurityEvent({
    eventType: "OWNER_ACCESS_GRANTED",
    severity: "LOW",
    userEmail: session.user.email,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    endpoint: context.endpoint,
    metadata: { source: "mfa_verify" }
  });

  return NextResponse.json({ success: true, mfaProof, verifiedAt });
}
