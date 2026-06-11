import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


import { requireAdmin } from "@/lib/adminGuard";


type IdentityPayload = {
name:string;
headline:string;
summary:string;
location?:string|null;
avatar?:string|null;
email?:string|null;
};


const jpegDataUrlPattern =
/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/;


function isAllowedAvatar(value:unknown){

if(value===null || value===undefined || value===""){

return true;

}

if(typeof value!=="string"){

return false;

}

if(value.startsWith("/")){

return !value.includes("..");

}

return jpegDataUrlPattern.test(value);

}


function toOptionalString(value:unknown){

return typeof value==="string" && value.trim()

?

value

:

null;

}



// PUBLIC READ


export async function GET(){



const data =

await prisma.identity.findFirst();




return NextResponse.json(

data

);



}









// OWNER ONLY UPDATE


export async function POST(req:Request){



if(!(await requireAdmin())){

return NextResponse.json(
{
error:"Unauthorized"
},
{
status:401
}
);

}

const body =

await req.json() as Record<string,unknown>;


if(!isAllowedAvatar(body.avatar)){

return NextResponse.json(

{
success:false,
error:"Profile image must be a JPG or JPEG file"
},

{
status:400
}

);

}


const payload:IdentityPayload={

name:
typeof body.name==="string" ? body.name : "",

headline:
typeof body.headline==="string" ? body.headline : "",

summary:
typeof body.summary==="string" ? body.summary : "",

location:
toOptionalString(body.location),

avatar:
toOptionalString(body.avatar),

email:
toOptionalString(body.email)

};








const existing =

await prisma.identity.findFirst();








const data =

existing

?

await prisma.identity.update({


where:{

id:existing.id

},



data:payload


})


:


await prisma.identity.create({


data:payload


});









return NextResponse.json(

data

);



}
