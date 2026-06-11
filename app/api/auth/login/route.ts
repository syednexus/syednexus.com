import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { adminSessionCookie, createAdminSessionToken } from "@/lib/auth";





export async function POST(req:Request){


try{


const body =
await req.json();


if(

!body ||

typeof body.password !== "string"

){

return NextResponse.json(

{
error:"INVALID"
},

{
status:401
}

);

}



const admin =
await prisma.adminUser.findUnique({

where:{

username:"owner"

}

});





if(!admin){


return NextResponse.json(
{error:"NO ADMIN"},
{status:401}
);


}





const valid =
await bcrypt.compare(

body.password,

admin.passwordHash

);







if(!valid){


return NextResponse.json(
{
error:"INVALID"
},
{
status:401
}
);


}







const response =
NextResponse.json({

success:true

});




response.cookies.set(

adminSessionCookie.name,

createAdminSessionToken(),

{

httpOnly:true,

secure:process.env.NODE_ENV==="production",

sameSite:"strict",

path:"/",

maxAge:adminSessionCookie.maxAge

}

);



return response;



}

catch(error){



return NextResponse.json(

{
error:"AUTH FAILED"
},

{
status:500
}

);



}


}
