import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { verifyAdminSessionToken } from "@/lib/auth";



export async function GET(){


const cookieStore =
await cookies();


const authenticated =
verifyAdminSessionToken(

cookieStore.get("nexus_admin")?.value

);



return NextResponse.json({authenticated});


}
