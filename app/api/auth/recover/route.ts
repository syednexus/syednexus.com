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

} = body;









if(

!recoveryKey ||

!newPassword

){



return NextResponse.json(

{

success:false,

error:"Missing recovery information"

},

{

status:400

}

);



}









if(

typeof recoveryKey !== "string" ||

typeof newPassword !== "string" ||

newPassword.length < 8

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
recoveryKey.trim(),
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

newPassword,

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
