import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";




// PUBLIC - DISPLAY PROJECTS

export async function GET(){


const projects =
await prisma.project.findMany({

orderBy:{

id:"desc"

}

});



return NextResponse.json(

projects

);


}









// OWNER ONLY - CREATE / UPDATE PROJECT


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






const project =
body.id

?

await prisma.project.update({


where:{

id:body.id

},


data:{


name:body.name,

category:body.category,

status:body.status,

description:body.description,

technologies:body.technologies


}


})


:


await prisma.project.create({


data:{


name:body.name,

category:body.category,

status:body.status,

description:body.description,

technologies:body.technologies


}


});









return NextResponse.json(

project

);



}









// OWNER ONLY - DELETE PROJECT


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






await prisma.project.delete({

where:{

id

}

});







return NextResponse.json({

success:true

});



}