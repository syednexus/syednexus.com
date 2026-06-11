import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";




export async function GET(){


const blogs =
await prisma.blog.findMany({

orderBy:{
date:"desc"
}

});


return NextResponse.json(blogs);


}










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
await req.json();





const payload={

title:body.title,

category:
body.category || "Learning Notes",

content:body.content,

tags:
body.tags || ""

};





const data =
body.id

?

await prisma.blog.update({

where:{
id:body.id
},

data:payload

})

:

await prisma.blog.create({

data:payload

});






return NextResponse.json(data);


}










export async function DELETE(req:Request){



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





const {id}=await req.json();




await prisma.blog.delete({

where:{
id

}

});




return NextResponse.json({

success:true

});


}