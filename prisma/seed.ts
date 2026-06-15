import "dotenv/config";


import { PrismaClient } from "../lib/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

import { profile } from "../data/profile";





const databaseUrl =

process.env.DATABASE_URL;





if(!databaseUrl){


throw new Error(

"DATABASE_URL missing"

);


}






const adapter =

new PrismaPg({

connectionString:databaseUrl

});






const prisma =

new PrismaClient({

adapter

});



async function main(){


if(
process.env.ALLOW_DB_SEED !== "true"
){

throw new Error(
"🚨 Database seed blocked. Set ALLOW_DB_SEED=true to continue."
);

}


console.log("🌱 Starting Nexus seed...");


// CLEAN OLD DATA


await prisma.identity.deleteMany();

await prisma.education.deleteMany();

await prisma.experience.deleteMany();

await prisma.skill.deleteMany();

await prisma.certification.deleteMany();

await prisma.project.deleteMany();

await prisma.blog.deleteMany();







// IDENTITY


await prisma.identity.create({

data:{

name:profile.identity.name,

headline:profile.identity.headline,

summary:profile.identity.summary,


location:
profile.identity.location,


avatar:
profile.identity.avatar,


email:

Array.isArray(profile.identity.email)

?

profile.identity.email[0]

:

profile.identity.email

,


linkedin:
profile.identity.linkedin,


github:
profile.identity.github,


resume:
profile.identity.resume

}

});








// EDUCATION


for(const edu of profile.education){


await prisma.education.create({

data:{


degree:edu.degree,

institution:edu.institution,

period:edu.period,

field:edu.field,


focus:

edu.focus.join(",")

}

});


}










// EXPERIENCE


for(const exp of profile.experience){


await prisma.experience.create({

data:{


role:exp.role,


company:exp.company,


period:exp.period,


domain:exp.domain,


details:

exp.details.join(",")


}


});


}









// SKILLS


for(

const category of Object.keys(profile.skills)

){


const list =

profile.skills[

category as keyof typeof profile.skills

];




for(const skill of list){


await prisma.skill.create({

data:{

category,

name:skill

}

});


}


}









// CERTIFICATIONS


for(const cert of profile.certifications){



await prisma.certification.create({

data:{


name:cert.name,


issuer:cert.issuer,


status:cert.status,


category:cert.category,


skills:

cert.skills.join(",")


}

});


}










// PROJECTS


for(const project of profile.projects){



await prisma.project.create({

data:{


name:project.name,


category:project.category,


status:project.status,


description:project.description,


technologies:

project.technologies.join(",")


}


});


}







// BLOGS


for(const blog of profile.blogs.posts as any[]){


await prisma.blog.create({

data:{


title:

blog.title ||

blog.name ||

"Untitled",



category:

blog.category ||

blog.type ||

"General",



content:

blog.content ||

blog.description ||

blog.summary ||

""


}


});


}










console.log("🔥 Nexus database seeded successfully");


}










main()

.catch(err=>{


console.error(err);


})

.finally(async()=>{


await prisma.$disconnect();


});
