import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";





import { MISSION_TYPES } from "@/types/mission";

const CATEGORIES = ["General", "Cryptography", "NetworkSecurity"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

function clean(value:unknown){

return typeof value==="string"
?
value.trim()
:
"";

}





function createSlug(value:string){

return value

.toLowerCase()

.replace(/[^a-z0-9]+/g,"-")

.replace(/(^-|-$)/g,"");

}








// READ MISSIONS — public DTO only (no answer / explanation / hints)


export async function GET(){


try{


const missions =

await prisma.mission.findMany({

where:{

active:true

},

select:{

id:true,

title:true,

slug:true,

type:true,

category:true,

difficulty:true,

description:true,

scenario:true,

content:true,

xp:true,

active:true,

createdAt:true,

updatedAt:true

},

orderBy:{

createdAt:"desc"

}


});



return NextResponse.json(missions);



}


catch(error){


console.error(

"MISSION READ ERROR",

error

);



return NextResponse.json([]);

}


}









// CREATE MISSION


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





const body = await req.json();



const title =
clean(body.title);



if(!title){


return NextResponse.json(

{
error:"Mission title required"
},

{
status:400
}

);


}







const mission =

await prisma.mission.create({

data:{


title,


slug:

body.slug

?

clean(body.slug)

:

createSlug(title),



type:

clean(body.type) as typeof MISSION_TYPES[number] ||

MISSION_TYPES[0],



category:

clean(body.category) as typeof CATEGORIES[number] ||

CATEGORIES[0],



difficulty:

clean(body.difficulty) as typeof DIFFICULTIES[number] ||

DIFFICULTIES[0],



description:

clean(body.description),



scenario:

clean(body.scenario),



content:

clean(body.content),



answer:

clean(body.answer),



explanation:

clean(body.explanation),



hints:

Array.isArray(body.hints)

?

body.hints

.filter((hint: unknown) => typeof hint === "string")

.map((hint: string) => clean(hint))

.filter(Boolean)

:

[],



xp:

Number(body.xp)

||

50



}


});





return NextResponse.json(mission);



}



catch(error){



console.error(

"MISSION CREATE ERROR",

error

);



return NextResponse.json(

{
error:"Mission save failed"
},

{
status:500
}

);


}



}

// DELETE MISSION


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
error:"Invalid ID"
},
{
status:400
}
);


}





await prisma.mission.delete({

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
"MISSION DELETE ERROR",
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