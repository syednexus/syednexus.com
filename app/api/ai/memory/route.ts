import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { isAdmin } from "@/lib/auth";




export async function GET(){


if(!(await isAdmin())){


return NextResponse.json(
{
error:"Unauthorized"
},
{
status:401
}
);


}


const memory =
await prisma.aiMemory.findMany();


return NextResponse.json(memory);


}





export async function POST(req:Request){


if(!(await isAdmin())){


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
await req.json();




const memory =
await prisma.aiMemory.create({

data:{

category:body.category,

content:body.content

}

});




return NextResponse.json(memory);


}
