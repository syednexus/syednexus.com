import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(){


const identity =
await prisma.identity.findFirst();


const admin =
await prisma.adminUser.count();


return NextResponse.json({

supabaseProject:
process.env.DATABASE_URL?.includes("uzxmzibxmmgmpejbvnmk"),

identity,

adminUsers:admin

});


}