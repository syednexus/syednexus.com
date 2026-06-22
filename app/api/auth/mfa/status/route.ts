import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { mfaEnabled: true }
  });

  return NextResponse.json({
    mfaEnabled: user?.mfaEnabled ?? false,
    mfaVerified: session.user.mfaVerified ?? !user?.mfaEnabled,
    hasPendingSetup: Boolean(user?.mfaEnabled === false)
  });
}
