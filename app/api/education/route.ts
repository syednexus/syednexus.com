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



const education =
await prisma.education.findMany({

orderBy:{

id:"desc"

}

});




return NextResponse.json(education);




}



catch(error){



console.error(

"EDUCATION READ ERROR",

error

);




return NextResponse.json(

{
error:"Education unavailable"
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


degree:
clean(body.degree),


institution:
clean(body.institution),


period:
clean(body.period),


field:
clean(body.field),


focus:
clean(body.focus)


};










if(

!payload.degree ||

!payload.institution ||

payload.degree.length > 150 ||

payload.focus.length > 1500

){



return NextResponse.json(

{
error:"Invalid education data"
},

{
status:400
}

);



}










const education =

typeof body.id==="number"

?


await prisma.education.update({

where:{

id:body.id

},

data:payload

})


:


await prisma.education.create({

data:payload

});









return NextResponse.json(

education

);






}




catch(error){



console.error(

"EDUCATION SAVE ERROR",

error

);





return NextResponse.json(

{
error:"Education save failed"
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
error:"Invalid education id"
},

{
status:400
}

);



}









await prisma.education.delete({


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

"EDUCATION DELETE ERROR",

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