import { NextResponse } from "next/server";

import { adminSessionCookie } from "@/lib/auth";



export async function POST(){


const res =
NextResponse.json({success:true});


res.cookies.set(

adminSessionCookie.name,

"",

{

httpOnly:true,

secure:process.env.NODE_ENV === "production",

sameSite:"lax",

maxAge:0,

path:"/"

}

);



return res;


}
