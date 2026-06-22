import { prisma } from "../../lib/prisma";


async function main(){


await prisma.mission.createMany({

skipDuplicates:true,


data:[

{

title:"Credential Theft Email",

slug:"credential-theft-email",

type:"PHISHING",

category:"Email Security",

difficulty:"Beginner",

description:
"Investigate a suspicious email.",

scenario:
"User reported an unusual password reset email.",

content:
"Analyze sender, URL and attachment.",

answer:"phishing",

explanation:
"Fake domain and malicious attachment indicate phishing.",

xp:200

}

]

});



console.log("PHISHING MISSIONS SEEDED");


}



main()
.catch(console.error)
.finally(()=>prisma.$disconnect());