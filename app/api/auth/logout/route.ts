import { NextResponse } from "next/server";

import { labSessionCookie } from "@/lib/auth/labSession";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set(labSessionCookie.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });

  return res;
}
