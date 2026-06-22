import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

import { authOptions } from "@/auth";
import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export async function POST(req: Request) {
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

  return NextResponse.json({ success: true, lastActivityAt: Date.now() });
}
