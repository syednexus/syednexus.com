import { NextResponse } from "next/server";

import { adminSessionCookie } from "@/lib/auth";





export async function POST(){


try{



const response =
NextResponse.json({

success:true,

message:"Logged out"

});







response.cookies.set(

adminSessionCookie.name,

"",

{

httpOnly:true,

secure:
process.env.NODE_ENV==="production",

sameSite:"strict",

path:"/",

maxAge:0

}

);







return response;




}



catch(error){



console.error(

"LOGOUT ERROR",

error

);




return NextResponse.json(

{
success:false,

error:"Logout failed"

},

{
status:500
}

);



}



}