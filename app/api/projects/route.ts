import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";







function clean(value:unknown){

return typeof value==="string"

?

value.trim()

:

"";

}










// PUBLIC READ


export async function GET(){


try{



const projects =
await prisma.project.findMany({

orderBy:{

id:"desc"

}

});




return NextResponse.json(projects);



}


catch(error){



console.error(

"PROJECT READ ERROR",

error

);




return NextResponse.json(

{
error:"Projects unavailable"
},

{
status:500
}

);



}



}











// OWNER CREATE / UPDATE


export async function POST(req:Request){



try{





if(!(await requireAdmin(req))){


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


name:
clean(body.name),


category:
clean(body.category),


status:
clean(body.status),


description:
clean(body.description),


technologies:
clean(body.technologies)


};









if(

!payload.name ||

payload.name.length > 100 ||

payload.description.length > 2000

){



return NextResponse.json(

{
error:"Invalid project data"
},

{
status:400
}

);



}










const project =

typeof body.id==="number"

?

await prisma.project.update({


where:{

id:body.id

},


data:payload


})


:


await prisma.project.create({

data:payload

});









return NextResponse.json(project);







}



catch(error){



console.error(

"PROJECT SAVE ERROR",

error

);





return NextResponse.json(

{
error:"Project save failed"
},

{
status:500
}

);



}



}












// OWNER DELETE


export async function DELETE(req:Request){



try{






if(!(await requireAdmin(req))){


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







if(typeof body.id !== "number"){


return NextResponse.json(

{
error:"Invalid project id"
},

{
status:400
}

);


}









await prisma.project.delete({

where:{

id:body.id

}

});








return NextResponse.json({

success:true

});







}



catch(error){



console.error(

"PROJECT DELETE ERROR",

error

);





return NextResponse.json(

{
error:"Delete failed"
},

{
status:500
}

);



}



}