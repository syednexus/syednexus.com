import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

import { isAdmin } from "@/lib/auth";





export async function POST(req:Request){


try{



if(!(await isAdmin())){


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