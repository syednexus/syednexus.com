import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  buildOtpAuthUri,
  createTotpSecret,
  encryptTotpSecret
} from "@/lib/security/totp";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({
    qrDataUrl,
    manualEntry: secret,
    message: "Scan the QR code, then enter a code to activate MFA."
  });
}
