import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";
import { generateRecoveryKey } from "@/lib/security/recoveryKey";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  if (await isRateLimited(req, "owner:mfa-recovery", 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, error: "Too many recovery attempts — wait 60 minutes" },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    void logSecurityEvent({
      eventType: "OWNER_ACCESS_DENIED",
      severity: "CRITICAL",
      userEmail: session?.user?.email ?? null,
      ...getRequestSecurityContext(req),
      metadata: { reason: "recovery_non_owner" }
    });

    return NextResponse.json({ success: false, error: "Owner Google login required" }, { status: 401 });
  }

  const context = getRequestSecurityContext(req);

  try {
    const body = (await req.json()) as { recoveryKey?: unknown };
    const recoveryKey = typeof body.recoveryKey === "string" ? body.recoveryKey.trim() : "";

    if (!recoveryKey) {
      return NextResponse.json({ success: false, error: "Recovery key required" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username: "owner" },
      select: { recoveryKeyHash: true }
    });

    if (!admin?.recoveryKeyHash) {
      return NextResponse.json({ success: false, error: "Recovery not configured" }, { status: 400 });
    }

    const valid = await bcrypt.compare(recoveryKey, admin.recoveryKeyHash);
    if (!valid) {
      void logSecurityEvent({
        eventType: "OWNER_ACCESS_DENIED",
        severity: "CRITICAL",
        userEmail: session.user.email,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        endpoint: context.endpoint,
        metadata: { reason: "invalid_recovery_key" }
      });

      return NextResponse.json({ success: false, error: "Invalid recovery key" }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        mfaEnabled: false,
        mfaSecret: null
      }
    });

    const nextRecoveryKey = generateRecoveryKey();
    const nextHash = await bcrypt.hash(nextRecoveryKey, 12);

    await prisma.adminUser.update({
      where: { username: "owner" },
      data: { recoveryKeyHash: nextHash }
    });

    console.info("[security] OWNER MFA recovery", {
      email: session.user.email,
      at: new Date().toISOString()
    });

    void logSecurityEvent({
      eventType: "RECOVERY_USED",
      severity: "CRITICAL",
      userEmail: session.user.email,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: { action: "mfa_recovery" }
    });

    void logSecurityEvent({
      eventType: "MFA_RESET",
      severity: "CRITICAL",
      userEmail: session.user.email,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: { source: "recovery" }
    });

    return NextResponse.json({
      success: true,
      recoveryKey: nextRecoveryKey,
      message: "MFA reset. Save the new recovery key, then set up MFA again in Vault Security."
    });
  } catch (error) {
    console.error("OWNER MFA RECOVERY ERROR", error);
    return NextResponse.json({ success: false, error: "Recovery failed" }, { status: 500 });
  }
}
