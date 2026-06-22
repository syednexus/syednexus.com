import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyStoredTotp } from "@/lib/security/totp";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { token?: string };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { mfaEnabled: true, mfaSecret: true }
  });

  if (!user?.mfaEnabled || !user.mfaSecret) {
    return NextResponse.json({ error: "MFA not enabled" }, { status: 400 });
  }

  if (!verifyStoredTotp(user.mfaSecret, token)) {
    return NextResponse.json({ error: "Invalid authenticator code" }, { status: 401 });
  }

  return NextResponse.json({ success: true, mfaVerified: true });
}
