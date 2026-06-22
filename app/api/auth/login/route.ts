import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

import {

adminSessionCookie,

createAdminSessionToken

} from "@/lib/auth";

import { isRateLimited } from "@/lib/rateLimit";

export async function POST(req:Request){


// Rate limit: 10 attempts per 15 minutes per IP
if (isRateLimited(req, "admin:login", 10, 15 * 60 * 1000)) {
  return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
}


try{


const body =
await req.json();


const password =
typeof body.password === "string"
? body.password
: "";



const admin =
await prisma.adminUser.findUnique({

where:{

username:"owner"

}

});



if(!admin || !password){

return NextResponse.json(

{error:"Access denied"},

{status:401}

);

}



const valid =
await bcrypt.compare(

password,

admin.passwordHash

);



if(!valid){

return NextResponse.json(

{error:"Access denied"},

{status:401}

);

}



const token =
createAdminSessionToken();


const res =
NextResponse.json({success:true});


res.cookies.set(

adminSessionCookie.name,

token,

{

httpOnly:true,

secure:process.env.NODE_ENV === "production",

sameSite:"lax",

maxAge:adminSessionCookie.maxAge,

path:"/"

}

);



return res;


}


catch(error){


console.error("LOGIN ERROR:",error);


return NextResponse.json(

{error:"Login failed"},

{status:500}

);


}


}
