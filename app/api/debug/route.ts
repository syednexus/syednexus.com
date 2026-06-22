import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/adminGuard";



export async function GET(){


const session =
await requireOwner();


if(!session){

return NextResponse.json(

{error:"Unauthorized"},

{status:401}

);

}


return NextResponse.json({

status:"ok",

role:session.user?.role ?? null

});


}
