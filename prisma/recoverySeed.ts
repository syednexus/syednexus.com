import bcrypt from "bcrypt";

import crypto from "crypto";

import { prisma } from "../lib/prisma";







async function main(){



const recoveryKey =

"NEXUS-" +

crypto.randomBytes(12)

.toString("hex")

.toUpperCase();








const hash =

await bcrypt.hash(

recoveryKey,

12

);








await prisma.adminUser.upsert({


where:{

username:"owner"

},


update:{

recoveryKeyHash:hash

},


create:{

username:"owner",

passwordHash:await bcrypt.hash(

process.env.ADMIN_PASSWORD ||

crypto.randomBytes(24).toString("hex"),

12

),

recoveryKeyHash:hash

}


});









console.log(

`

================================

NEXUS RECOVERY KEY CREATED


${recoveryKey}


SAVE THIS KEY.
IT WILL NOT BE SHOWN AGAIN.

================================

`

);




}






main()

.finally(()=>{

prisma.$disconnect();

});
