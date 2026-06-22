import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { shouldRequireMfaChallenge } from "@/lib/security/mfaSession";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

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

export const config = {
  matcher: ["/vault", "/vault/:path*"]
};
