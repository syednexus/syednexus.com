import { prisma } from "../../lib/prisma";



async function main(){


await prisma.mission.createMany({

skipDuplicates:true,

data:[

{

title:"Linux Log Investigation",

slug:"linux-log-investigation",

type:"TERMINAL",

category:"Linux",

difficulty:"Beginner",

description:"Investigate authentication logs using terminal commands.",

scenario:
"You received an alert about failed SSH logins. Analyse the logs and identify the attack.",

content:
"Use terminal commands to inspect files.",

answer:"brute force",

explanation:
"Multiple failed SSH authentication attempts indicate brute force activity.",

xp:150

},



{

title:"Open Port Discovery",

slug:"open-port-discovery",

type:"TERMINAL",

category:"Recon",

difficulty:"Beginner",

description:"Discover exposed services on a target machine.",

scenario:
"Scan the server and identify the exposed remote access service.",

content:
"Use nmap target",

answer:"ssh",

explanation:
"Port 22 SSH was exposed on the machine.",

xp:100

}


]


});



console.log("TERMINAL MISSIONS SEEDED");


}




main()
.catch(console.error)
.finally(()=>prisma.$disconnect());