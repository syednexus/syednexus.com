import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";



export async function GET(){


try{


const admin =
await prisma.adminUser.findUnique({

where:{

username:"owner"

},

select:{

username:true,

createdAt:true

}

});



return NextResponse.json({

database:true,

adminExists:!!admin,

admin

});


}


catch(error:any){


return NextResponse.json({

database:false,

error:error.message

});

}


}