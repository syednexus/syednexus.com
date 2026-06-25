import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

import { createLabSessionToken, labSessionCookie } from "@/lib/auth/labSession";

import { isRateLimited } from "@/lib/rateLimit";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req: Request) {
  if (isRateLimited(req, "lab:unlock", 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many unlock attempts" }, { status: 429 });
  }

  const context = getRequestSecurityContext(req);

  try {
    const body = await req.json();
    const password = typeof body.password === "string" ? body.password : "";

    const admin = await prisma.adminUser.findUnique({
      where: { username: "owner" }
    });

    if (!admin || !password) {
      void logSecurityEvent({
        eventType: "LOGIN_FAILED",
        severity: "MEDIUM",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        endpoint: context.endpoint,
        metadata: { source: "lab-login" }
      });
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);

    if (!valid) {
      void logSecurityEvent({
        eventType: "LOGIN_FAILED",
        severity: "MEDIUM",
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        endpoint: context.endpoint,
        metadata: { source: "lab-login" }
      });
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const token = createLabSessionToken();
    const res = NextResponse.json({ success: true, scope: "lab" });

    void logSecurityEvent({
      eventType: "LOGIN_SUCCESS",
      severity: "LOW",
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: { source: "lab-login" }
    });

    res.cookies.set(labSessionCookie.name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: labSessionCookie.maxAge,
      path: "/"
    });

    return res;
  } catch (error) {
    console.error("LAB UNLOCK ERROR:", error);
    return NextResponse.json({ error: "Lab unlock failed" }, { status: 500 });
  }
}
