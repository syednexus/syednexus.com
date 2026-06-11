import "dotenv/config";

import { prisma } from "../lib/prisma";

import bcrypt from "bcrypt";





async function main(){


const password =
process.env.ADMIN_PASSWORD;




if(!password){

throw new Error(
"ADMIN_PASSWORD missing"
);

}




const hash =
await bcrypt.hash(

password,

12

);





await prisma.adminUser.upsert({


where:{

username:"owner"

},



update:{

passwordHash:hash

},



create:{


username:"owner",


passwordHash:hash


}


});





console.log(

"✅ Nexus admin created"

);


}






main()


.catch(console.error)


.finally(async()=>{


await prisma.$disconnect();


});