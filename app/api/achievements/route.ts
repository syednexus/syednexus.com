import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";





export async function GET(){


try{


const session =
await getServerSession();





const achievements =
await prisma.achievement.findMany({

orderBy:{

id:"asc"

}

});






if(!session?.user?.email){


return NextResponse.json(

achievements.map(a=>({

...a,

unlocked:false

}))

);


}







const user =
await prisma.user.findUnique({

where:{

email:session.user.email

},

include:{

missionProgress:true,

achievementUnlocks:true

}

});





if(!user){


return NextResponse.json(

achievements.map(a=>({

...a,

unlocked:false

}))

);


}







const xp =

user.missionProgress.reduce(

(total,item)=> total + item.score,

0

);

const alreadyUnlocked =

user.achievementUnlocks.map(u=>u.achievementId);

const toUnlock = achievements

.filter(a=>{

const required = Number(

a.requirement.replace(/\D/g,"")

)||0;

return !alreadyUnlocked.includes(a.id) && xp >= required;

});

if(toUnlock.length > 0){

await prisma.achievementUnlock.createMany({

data:toUnlock.map(a=>({

achievementId:a.id,

userId:user.id

})),

skipDuplicates:true

});

}
















const unlocked =
await prisma.achievementUnlock.findMany({

where:{

userId:user.id

}

});







return NextResponse.json(


achievements.map(a=>({


...a,


unlocked:

unlocked.some(

u=>u.achievementId===a.id

)


}))


);






}


catch(error){



console.error(

"ACHIEVEMENT ERROR",

error

);



return NextResponse.json([]);

}


}