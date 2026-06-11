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








await prisma.adminUser.update({


where:{

username:"owner"

},


data:{

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