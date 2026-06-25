import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { verifyLabSessionToken } from "@/lib/auth/labSession";

export async function GET() {
  const cookieStore = await cookies();
  const authenticated = verifyLabSessionToken(cookieStore.get("nexus_lab")?.value);

  return NextResponse.json({ authenticated, scope: authenticated ? "lab" : null });
}
