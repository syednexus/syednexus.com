import { prisma } from "../../lib/prisma";



async function main(){


await prisma.mission.createMany({

skipDuplicates:true,


data:[


{

title:"SIEM Brute Force Investigation",

slug:"siem-bruteforce",

type:"SIEM",

category:"Threat Detection",

difficulty:"Intermediate",

description:
"Use SIEM logs to identify authentication attack.",

scenario:
`
SOC received multiple failed authentication alerts.

Search security events and identify the attack type.
`,

content:
`
Try:

index=auth failed

Investigate source IP and MITRE technique.
`,

answer:"brute force",

explanation:
"Multiple failed login attempts mapped to MITRE T1110 indicate brute force.",

xp:250

},






{

title:"Suspicious PowerShell Execution",

slug:"siem-powershell",

type:"SIEM",

category:"Endpoint Security",

difficulty:"Intermediate",

description:
"Investigate suspicious encoded PowerShell activity.",


scenario:
`
EDR generated an alert for unusual process execution.
Analyse events.
`,


content:
`
Search:

powershell

Find suspicious technique.
`,


answer:"t1059",

explanation:
"PowerShell execution maps to MITRE T1059 Command Interpreter.",

xp:300

}


]


});



console.log("SIEM MISSIONS SEEDED");


}




main()

.catch(console.error)

.finally(()=>prisma.$disconnect());