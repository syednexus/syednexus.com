import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/adminGuard";

export async function GET() {
  // Hard-block in production — debug endpoint must never be reachable live
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await requireOwner();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    status: "ok",
    role: session.user?.role ?? null
  });
}
