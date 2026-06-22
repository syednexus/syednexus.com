import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

import { isRateLimited } from "@/lib/rateLimit";

const PASSWORD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;

export async function POST(req:Request){

// Rate limit: 3 attempts per 60 minutes per IP — recovery is high-value
if (isRateLimited(req, "admin:recover", 3, 60 * 60 * 1000)) {
  return NextResponse.json(
    { success: false, error: "Too many recovery attempts — wait 60 minutes" },
    { status: 429 }
  );
}

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



if(!recoveryKey || !PASSWORD_COMPLEXITY.test(newPassword)){

return NextResponse.json(

{

success:false,

error:"Recovery key and a strong password (12+ chars, upper, lower, number, symbol) required"

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
