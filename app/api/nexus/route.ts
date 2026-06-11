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

] = await Promise.all([



// SAFE IDENTITY

prisma.identity.findFirst({

select:{

name:true,

headline:true,

summary:true,

location:true,

avatar:true

}

}),





// SAFE EDUCATION

prisma.education.findMany({

select:{

degree:true,

institution:true,

period:true,

field:true,

focus:true

}

}),





// SAFE EXPERIENCE

prisma.experience.findMany({

select:{

role:true,

company:true,

period:true,

domain:true,

details:true

}

}),





// SAFE SKILLS

prisma.skill.findMany({

select:{

category:true,

name:true

}

}),





// SAFE CERTS

prisma.certification.findMany({

select:{

name:true,

issuer:true,

status:true,

category:true,

skills:true

}

}),






// SAFE PROJECTS

prisma.project.findMany({

select:{

name:true,

category:true,

status:true,

description:true,

technologies:true

}

}),





// SAFE BLOGS

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


if(skill.category in skillGroups){


skillGroups[

skill.category as keyof typeof skillGroups

].push(skill.name);


}


});








return Response.json({


identity,


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



return Response.json(

{

error:

"Nexus unavailable"

},

{

status:500

}

);



}



}
