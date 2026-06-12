import { NextResponse } from "next/server";

import { executeCommand } from "@/lib/commandEngine";

import { requireAdmin } from "@/lib/adminGuard";





export async function POST(req:Request){


try{



// OWNER ONLY

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





if(

!body ||

typeof body.command !== "string"

){


return NextResponse.json(

{
error:"Invalid command"
},

{
status:400
}

);


}








const command =
body.command.trim();







// prevent abuse payloads

if(

command.length===0 ||

command.length>100

){


return NextResponse.json(

{
error:"Command rejected"
},

{
status:400
}

);


}









const result =
executeCommand(command);






return NextResponse.json(result);





}



catch(error){



console.error(

"TERMINAL ERROR",

error

);




return NextResponse.json(

{
error:"Terminal failure"
},

{
status:500
}

);



}



}