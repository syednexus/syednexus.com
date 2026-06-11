import { prisma } from "../lib/prisma";



async function main(){


await prisma.aiMemory.createMany({

data:[


{

category:"career_goal",

content:
"Syed is building towards cybersecurity roles including SOC Analyst, Security Analyst and future Security Engineer."


},



{

category:"learning",

content:
"Syed is improving practical skills through TryHackMe, Cisco, Nessus labs, Burp Suite and security projects."


},



{

category:"assistant_style",

content:
"Provide realistic feedback. Do not oversell. Explain strengths and weaknesses clearly."


}



]


});


console.log("AI memory installed");


}



main();