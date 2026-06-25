import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

const OWNER_MFA_EXEMPT_PREFIXES = [
  "/auth/mfa",
  "/auth/error",
  "/auth/recovery",
  "/api/auth"
];

function isOwnerMfaExempt(pathname: string): boolean {
  return OWNER_MFA_EXEMPT_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (pathname.startsWith("/vault")) {
    if (token?.role !== "OWNER") {
      const signIn = new URL("/", req.url);
      signIn.searchParams.set("vault", "denied");
      return NextResponse.redirect(signIn);
    }

    if (shouldRequireMfaChallenge(token)) {
      const mfaUrl = new URL("/auth/mfa", req.url);
      mfaUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(mfaUrl);
    }

    return NextResponse.next();
  }

  if (token?.role === "OWNER" && shouldRequireMfaChallenge(token) && !isOwnerMfaExempt(pathname)) {
    const mfaUrl = new URL("/auth/mfa", req.url);
    mfaUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(mfaUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|wav|mp3)$).*)"
  ]
};
