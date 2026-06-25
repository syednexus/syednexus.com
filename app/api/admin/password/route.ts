import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

export async function POST(req:Request){


try{



const adminSession = await requireAdmin(req);

if(!adminSession){


return NextResponse.json(
{
success:false,
error:"Unauthorized"
},
{
status:401
}
);


}

const ownerEmail = adminSession.user?.email ?? null;
const auditContext = getRequestSecurityContext(req);







const body =
await req.json();




const {

currentPassword,

newPassword

}=body;







if(

typeof currentPassword !== "string" ||

typeof newPassword !== "string"

){


return NextResponse.json(
{
success:false,
error:"Invalid request"
},
{
status:400
}
);


}








if(newPassword.length < 8){


return NextResponse.json(
{
success:false,
error:"Password must be at least 8 characters"
},
{
status:400
}
);


}









const admin =
await prisma.adminUser.findUnique({

where:{

username:"owner"

}

});








if(!admin){


return NextResponse.json(
{
success:false,
error:"Admin missing"
},
{
status:404
}
);


}








const valid =
await bcrypt.compare(

currentPassword,

admin.passwordHash

);







if(!valid){


void logSecurityEvent({
  eventType: "LOGIN_FAILED",
  severity: "HIGH",
  userEmail: ownerEmail,
  ...auditContext,
  metadata: { reason: "admin_password_wrong", action: "password_change" }
});

return NextResponse.json(
{
success:false,
error:"Incorrect current password"
},
{
status:401
}
);


}









const hash =
await bcrypt.hash(

newPassword,

12

);









await prisma.adminUser.update({


where:{

username:"owner"

},


data:{

passwordHash:hash

}


});










void logSecurityEvent({
  eventType: "PROFILE_CHANGED",
  severity: "HIGH",
  userEmail: ownerEmail,
  ...auditContext,
  metadata: { action: "admin_password_updated" }
});

return NextResponse.json({

success:true,

message:"Password updated"

});




}


catch(error){


console.error(

"PASSWORD UPDATE ERROR:",

error

);




return NextResponse.json(
{
success:false,
error:"Update failed"
},
{
status:500
}
);


}



}