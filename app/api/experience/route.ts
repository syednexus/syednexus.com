import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


import { requireAdmin } from "@/lib/adminGuard";




// PUBLIC READ


export async function GET(){



return NextResponse.json(

await prisma.experience.findMany()

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

await prisma.experience.update({


where:{

id:body.id

},



data:{

role:body.role,

company:body.company,

period:body.period,

domain:body.domain,

details:body.details

}


})


:


await prisma.experience.create({


data:{

role:body.role,

company:body.company,

period:body.period,

domain:body.domain,

details:body.details

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








await prisma.experience.delete({

where:{

id

}

});









return NextResponse.json({

success:true

});



}