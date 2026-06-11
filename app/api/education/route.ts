import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


import { requireAdmin } from "@/lib/adminGuard";




// PUBLIC READ


export async function GET(){



return NextResponse.json(

await prisma.education.findMany()

);



}









// OWNER ONLY CREATE / UPDATE


export async function POST(req:Request){

if(!(await requireAdmin())){

return Response.json(
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








const data =

body.id

?

await prisma.education.update({

where:{

id:body.id

},


data:{

degree:body.degree,

institution:body.institution,

period:body.period,

field:body.field,

focus:body.focus

}


})


:


await prisma.education.create({

data:{

degree:body.degree,

institution:body.institution,

period:body.period,

field:body.field,

focus:body.focus

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








await prisma.education.delete({

where:{

id

}

});








return NextResponse.json({

success:true

});



}