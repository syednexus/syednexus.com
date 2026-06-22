import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";





function getRank(xp:number){


if(xp >= 5000){

return {
rank:"RED TEAM OPERATOR",
next:10000
};

}


if(xp >= 3000){

return {
rank:"THREAT HUNTER",
next:5000
};

}


if(xp >= 1500){

return {
rank:"INCIDENT RESPONDER",
next:3000
};

}


if(xp >= 500){

return {
rank:"SOC TIER 1 ANALYST",
next:1500
};

}


return {
rank:"TRAINEE ANALYST",
next:500
};


}









export async function GET(){


try{


const session =
await getServerSession();




if(!session?.user?.email){


return NextResponse.json({

xp:0,

rank:"GUEST",

completed:0,

next:500,

progress:0,

completedMissionIds:[]

});


}









const user =
await prisma.user.findUnique({

where:{

email:session.user.email

},

include:{

missionProgress:true

}

});








if(!user){


return NextResponse.json({

xp:0,

rank:"UNKNOWN",

completed:0,

next:500,

progress:0,

completedMissionIds:[]

});


}











const completedMissions =

user.missionProgress.filter(

m=>m.completed

);








const xp =

completedMissions.reduce(

(total,item)=>total+item.score,

0

);






const level =
getRank(xp);






const progress =

Math.min(

Math.round(

(xp / level.next) * 100

),

100

);








return NextResponse.json({


xp,


rank:level.rank,


next:level.next,


progress,


completed:completedMissions.length,

completedMissionIds:completedMissions.map(item => item.missionId)


});








}


catch(error){



console.error(

"ANALYST API ERROR",

error

);




return NextResponse.json({

xp:0,

rank:"ERROR",

completed:0,

next:500,

progress:0,

completedMissionIds:[]

});


}


}