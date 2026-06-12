import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { isAdmin } from "@/lib/auth";





export async function GET(){


try{


if(!(await isAdmin())){


return NextResponse.json(

{
error:"Unauthorized"
},

{
status:401
}

);


}




const memory =
await prisma.aiMemory.findMany({

orderBy:{

createdAt:"desc"

}

});




return NextResponse.json(memory);



}


catch(error){


console.error(
"AI MEMORY GET ERROR",
error
);


return NextResponse.json(

{
error:"Memory unavailable"
},

{
status:500
}

);


}



}









export async function POST(req:Request){


try{



if(!(await isAdmin())){


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






if(

!body ||

typeof body.category !== "string" ||

typeof body.content !== "string"

){



return NextResponse.json(

{
error:"Invalid data"
},

{
status:400
}

);


}






const category =
body.category.trim();


const content =
body.content.trim();







if(

category.length < 2 ||

category.length > 50 ||

content.length < 5 ||

content.length > 2000

){



return NextResponse.json(

{
error:"Memory rejected"
},

{
status:400
}

);


}









const memory =
await prisma.aiMemory.create({

data:{

category,

content

}

});







return NextResponse.json(memory);




}



catch(error){



console.error(

"AI MEMORY SAVE ERROR",

error

);




return NextResponse.json(

{
error:"Memory save failed"
},

{
status:500
}

);



}



}