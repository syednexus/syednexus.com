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


const skills =
await prisma.skill.findMany({

orderBy:{

category:"asc"

}

});



return NextResponse.json(skills);



}



catch(error){


console.error(

"SKILLS READ ERROR",

error

);



return NextResponse.json(

{
error:"Skills unavailable"
},

{
status:500
}

);


}



}












// CREATE / UPDATE SKILL


export async function POST(req:Request){


try{





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


category:
clean(body.category),


name:
clean(body.name)


};








if(

!payload.category ||

!payload.name ||

payload.category.length > 50 ||

payload.name.length > 100

){



return NextResponse.json(

{
error:"Invalid skill data"
},

{
status:400
}

);


}










const skill =

typeof body.id==="number"

?

await prisma.skill.update({

where:{

id:body.id

},


data:payload


})

:

await prisma.skill.create({

data:payload

});








return NextResponse.json(skill);





}



catch(error){



console.error(

"SKILL SAVE ERROR",

error

);





return NextResponse.json(

{
error:"Skill save failed"
},

{
status:500
}

);



}



}












// DELETE SKILL


export async function DELETE(req:Request){



try{





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







if(typeof body.id !== "number"){



return NextResponse.json(

{
error:"Invalid skill id"
},

{
status:400
}

);


}








await prisma.skill.delete({

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

"SKILL DELETE ERROR",

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