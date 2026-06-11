import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";





// PUBLIC READ


export async function GET(){



return NextResponse.json(

await prisma.certification.findMany()

);



}









// OWNER ONLY CREATE / UPDATE


export async function POST(req:Request){




if(!(await requireAdmin())){



return NextResponse.json(

{
success:false,
error:"Unauthorized"
},

{
status:401
}

);



}







const body =
await req.json();








const data =

body.id

?

await prisma.certification.update({

where:{

id:body.id

},


data:{


name:body.name,

issuer:body.issuer,

status:body.status,

category:body.category,

skills:body.skills


}


})


:


await prisma.certification.create({

data:{

name:body.name,

issuer:body.issuer,

status:body.status,

category:body.category,

skills:body.skills

}


});








return NextResponse.json(

data

);



}









// OWNER ONLY DELETE


export async function DELETE(req:Request){



if(!(await requireAdmin())){



return NextResponse.json(

{
success:false,
error:"Unauthorized"
},

{
status:401
}

);



}








const {id} =
await req.json();








await prisma.certification.delete({

where:{

id

}

});








return NextResponse.json({

success:true

});



}