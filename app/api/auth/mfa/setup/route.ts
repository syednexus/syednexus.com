import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVaultAccess } from "@/lib/security/requireVaultAccess";
import {
  buildOtpAuthUri,
  createTotpSecret,
  encryptTotpSecret
} from "@/lib/security/totp";

import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  if (!(await getVaultAccess(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const context = getRequestSecurityContext(req);
  const secret = createTotpSecret();
  const otpauthUrl = buildOtpAuthUri(session.user.email, secret);

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      mfaSecret: encryptTotpSecret(secret),
      mfaEnabled: false
    }
  });

  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  void logSecurityEvent({
    eventType: "MFA_SUCCESS",
    severity: "LOW",
    userEmail: session.user.email,
    ...context,
    metadata: { action: "setup_initiated", source: "mfa_setup" }
  });

  return NextResponse.json({
    qrDataUrl,
    manualEntry: secret,
    message: "Scan the QR code, then enter a code to activate MFA."
  });
}
