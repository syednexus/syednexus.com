import { prisma } from "../../lib/prisma";



async function main(){


await prisma.achievement.createMany({

skipDuplicates:true,


data:[


{

name:"First Response",

description:"Complete your first SOC investigation",

icon:"🛡️",

requirement:"Complete 1 mission"

},



{

name:"SOC Rookie",

description:"Reach 250 analyst XP",

icon:"🎯",

requirement:"Earn 250 XP"

},



{

name:"Threat Hunter",

description:"Investigate advanced incidents",

icon:"🔥",

requirement:"Earn 500 XP"

},



{

name:"Blue Team Analyst",

description:"Reach professional SOC analyst rank",

icon:"🧠",

requirement:"Earn 1000 XP"

}


]


});



console.log("ACHIEVEMENTS SEEDED");


}





main()

.catch(console.error)

.finally(async()=>{

await prisma.$disconnect();

});