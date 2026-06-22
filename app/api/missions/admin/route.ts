import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/security/requireOwner";

/** Owner-only full mission list for vault MissionEditor. */
export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(missions);
  } catch (error) {
    console.error("MISSION ADMIN READ ERROR", error);
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}
