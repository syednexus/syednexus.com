import "dotenv/config";

import { PrismaClient } from "../../lib/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({
  adapter,
});



async function main(){


await prisma.mission.upsert({

where:{
slug:"suspicious-ssh-login"
},


update:{},


create:{

title:"Suspicious SSH Login",

slug:"suspicious-ssh-login",

type:"SOC_ALERT",

category:"Threat Detection",

difficulty:"Beginner",

description:
"Investigate multiple failed SSH attempts from an unknown IP.",


scenario:
"Server logs show repeated authentication failures.",


content:
`
Jun 20 10:31 sshd[441]: Failed password for root from 45.33.21.10
Jun 20 10:32 sshd[448]: Failed password for admin from 45.33.21.10
Jun 20 10:33 sshd[455]: Accepted password from unknown location
`,


answer:
"Brute Force",


explanation:
"Multiple failed authentication attempts followed by successful login indicates brute force compromise.",


xp:100,


active:true

}


});



console.log("SOC missions seeded successfully");


}



main()

.catch(console.error)

.finally(async()=>{

await prisma.$disconnect();

});