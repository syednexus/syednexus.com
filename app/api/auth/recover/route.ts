import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";



export async function POST(req:Request){


try{


const body =
await req.json();


const recoveryKey =
typeof body.recoveryKey === "string"
? body.recoveryKey.trim()
: "";


const newPassword =
typeof body.newPassword === "string"
? body.newPassword
: "";



if(!recoveryKey || newPassword.length < 8){

return NextResponse.json(

{

success:false,

error:"Recovery key and new password (8+ chars) required"

},

{status:400}

);

}



const admin =
await prisma.adminUser.findUnique({

where:{

username:"owner"

}

});



if(!admin?.recoveryKeyHash){

return NextResponse.json(

{

success:false,

error:"Recovery not configured"

},

{status:400}

);

}



const valid =
await bcrypt.compare(

recoveryKey,

admin.recoveryKeyHash

);



if(!valid){

return NextResponse.json(

{

success:false,

error:"Invalid recovery key"

},

{status:401}

);

}



const passwordHash =
await bcrypt.hash(

newPassword,

12

);



await prisma.adminUser.update({

where:{

username:"owner"

},

data:{

passwordHash

}

});



return NextResponse.json({success:true});


}


catch(error){


console.error("RECOVERY ERROR:",error);


return NextResponse.json(

{

success:false,

error:"Recovery failed"

},

{status:500}

);


}


}
