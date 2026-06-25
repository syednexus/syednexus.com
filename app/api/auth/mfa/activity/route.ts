import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

import { authOptions } from "@/auth";
import { generateMfaProof } from "@/lib/security/mfaProof";
import { isRateLimited } from "@/lib/rateLimit";
import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export async function POST(req: Request) {
  if (isRateLimited(req, "mfa:activity", 30, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many activity pings" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({
    req: req as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token || shouldRequireMfaChallenge(token)) {
    return NextResponse.json({ error: "MFA required" }, { status: 403 });
  }

  const now = Date.now();
  const emailLower = session.user.email.trim().toLowerCase();
  const activityProof = generateMfaProof(emailLower, "activity", now);

  return NextResponse.json({
    success: true,
    lastActivityAt: now,
    verifiedAt: now,
    activityProof
  });
}
