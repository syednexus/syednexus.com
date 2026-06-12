import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";






export async function GET(){



try{





const [

identity,

education,

experience,

skills,

certifications,

projects,

blogs


]=await Promise.all([







prisma.identity.findFirst({

select:{

name:true,

headline:true,

summary:true,

location:true,

avatar:true,

email:true,

linkedin:true,

github:true,

resume:true

}

}),







prisma.education.findMany({

select:{

degree:true,

institution:true,

period:true,

field:true,

focus:true

}

}),








prisma.experience.findMany({

select:{

role:true,

company:true,

period:true,

domain:true,

details:true

}

}),








prisma.skill.findMany({

select:{

category:true,

name:true

}

}),









prisma.certification.findMany({

select:{

name:true,

issuer:true,

status:true,

category:true,

skills:true

}

}),








prisma.project.findMany({

select:{

name:true,

category:true,

status:true,

description:true,

technologies:true

}

}),








prisma.blog.findMany({

select:{

id:true,

title:true,

category:true,

content:true,

tags:true,

date:true

},


orderBy:{

date:"desc"

}


})


]);










const skillGroups={

cybersecurity:[] as string[],

tools:[] as string[],

programming:[] as string[],

pharmacy:[] as string[]

};









skills.forEach(skill=>{


const category =
skill.category as keyof typeof skillGroups;



if(skillGroups[category]){


skillGroups[category].push(

skill.name

);


}


});









return NextResponse.json({



identity:



identity || {

name:"",

headline:"",

summary:"",

location:null,

avatar:null,

email:null,

linkedin:null,

github:null,

resume:null

},




education,


experience,


skills:skillGroups,


certifications,


projects,


blogs:{

posts:blogs

}



});









}



catch(error){





console.error(

"NEXUS PUBLIC API ERROR",

error

);






return NextResponse.json(


{

identity:null,

education:[],

experience:[],

skills:{},

certifications:[],

projects:[],

blogs:{

posts:[]

}

},


{
status:200
}


);




}




}