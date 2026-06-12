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



const experience =
await prisma.experience.findMany({

orderBy:{

id:"desc"

}

});




return NextResponse.json(experience);




}



catch(error){



console.error(

"EXPERIENCE READ ERROR",

error

);




return NextResponse.json(

{
error:"Experience unavailable"
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


role:
clean(body.role),


company:
clean(body.company),


period:
clean(body.period),


domain:
clean(body.domain),


details:
clean(body.details)


};










if(

!payload.role ||

!payload.company ||

payload.role.length > 150 ||

payload.details.length > 2000

){



return NextResponse.json(

{
error:"Invalid experience data"
},

{
status:400
}

);



}











const experience =

typeof body.id==="number"

?


await prisma.experience.update({

where:{

id:body.id

},

data:payload


})


:


await prisma.experience.create({

data:payload

});










return NextResponse.json(

experience

);







}




catch(error){



console.error(

"EXPERIENCE SAVE ERROR",

error

);




return NextResponse.json(

{
error:"Experience save failed"
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
error:"Invalid experience id"
},

{
status:400
}

);



}










await prisma.experience.delete({


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

"EXPERIENCE DELETE ERROR",

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