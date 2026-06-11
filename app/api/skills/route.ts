import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";



// PUBLIC READ

export async function GET(){


const skills =
await prisma.skill.findMany({

orderBy:{

category:"asc"

}

});


return NextResponse.json(skills);


}









// CREATE / UPDATE SKILL

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





let skill;



if(body.id){



skill =
await prisma.skill.update({

where:{

id:body.id

},

data:{

category:body.category,

name:body.name

}

});



}

else{



skill =
await prisma.skill.create({

data:{

category:body.category,

name:body.name

}

});



}





return NextResponse.json(skill);



}









// DELETE SINGLE SKILL


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







const body =
await req.json();




await prisma.skill.delete({

where:{

id:body.id

}

});





return NextResponse.json({

success:true

});



}