import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Password recovery is disabled. Sign in with Google as OWNER and use /auth/recovery for MFA recovery."
    },
    { status: 410 }
  );
}
