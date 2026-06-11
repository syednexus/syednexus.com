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






if(

!body.password ||

body.password.length < 6

){



return NextResponse.json(

{
success:false,
error:"Password too short"
},

{
status:400
}

);



}









const hash =
await bcrypt.hash(

body.password,

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