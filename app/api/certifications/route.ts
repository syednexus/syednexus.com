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



const certifications =
await prisma.certification.findMany({

orderBy:{

id:"desc"

}

});





return NextResponse.json(certifications);



}



catch(error){



console.error(

"CERTIFICATION READ ERROR",

error

);



return NextResponse.json(

{
error:"Certifications unavailable"
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


issuer:
clean(body.issuer),


status:
clean(body.status),


category:
clean(body.category),


skills:
clean(body.skills)


};









if(

!payload.name ||

!payload.issuer ||

payload.name.length > 150 ||

payload.skills.length > 1000

){



return NextResponse.json(

{
error:"Invalid certification data"
},

{
status:400
}

);



}











const certification =

typeof body.id==="number"

?


await prisma.certification.update({


where:{

id:body.id

},


data:payload


})


:


await prisma.certification.create({


data:payload


});









return NextResponse.json(certification);






}




catch(error){



console.error(

"CERTIFICATION SAVE ERROR",

error

);





return NextResponse.json(

{
error:"Certification save failed"
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
error:"Invalid certification id"
},

{
status:400
}

);



}









await prisma.certification.delete({


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

"CERTIFICATION DELETE ERROR",

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