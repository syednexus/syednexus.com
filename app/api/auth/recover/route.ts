import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";







export async function POST(req:Request){


try{



const body =
await req.json();




const {

recoveryKey,

newPassword

}=body;







if(

typeof recoveryKey !== "string" ||

typeof newPassword !== "string"

){


return NextResponse.json(
{
success:false,
error:"Invalid recovery information"
},
{
status:400
}
);


}







const cleanRecoveryKey =
recoveryKey.trim();



const cleanPassword =
newPassword.trim();








if(

cleanRecoveryKey.length < 8 ||

cleanPassword.length < 8

){



return NextResponse.json(
{
success:false,
error:"Invalid recovery information"
},
{
status:400
}
);


}








const strongPassword =

/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;



if(!strongPassword.test(cleanPassword)){



return NextResponse.json(
{
success:false,
error:"Password complexity requirement failed"
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









if(

!admin ||

!admin.recoveryKeyHash

){



return NextResponse.json(
{
success:false,
error:"Recovery unavailable"
},
{
status:401
}
);


}









const validRecovery =
await bcrypt.compare(

cleanRecoveryKey,

admin.recoveryKeyHash

);







if(!validRecovery){



return NextResponse.json(
{
success:false,
error:"Invalid recovery key"
},
{
status:401
}
);


}










const newHash =
await bcrypt.hash(

cleanPassword,

12

);










await prisma.adminUser.update({

where:{

username:"owner"

},

data:{

passwordHash:newHash

}

});










return NextResponse.json({

success:true,

message:"Password recovered"

});





}


catch(error){



console.error(

"RECOVERY ERROR",

error

);




return NextResponse.json(
{
success:false,
error:"Recovery failed"
},
{
status:500
}
);


}



}