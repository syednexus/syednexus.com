import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";

import { prisma } from "@/lib/prisma";



const ai = new GoogleGenAI({

apiKey:process.env.GEMINI_API_KEY!

});








async function runGemini(prompt:string){



const models=[

"gemini-2.5-flash",

"gemini-2.0-flash-lite"

];




for(const model of models){


try{


const response =
await ai.models.generateContent({

model,

contents:prompt

});



if(response.text){


return response.text;


}



}


catch(error){


console.log(

`${model} unavailable`

);


}



}




return null;


}









export async function POST(req:Request){



try{



const body =
await req.json();



const message =
body.message;



if(

typeof message !== "string" ||

message.trim().length===0 ||

message.length > 2000

){

return NextResponse.json(

{
success:false,
reply:"Please send a message under 2000 characters."
},

{
status:400
}

);

}


const history =
Array.isArray(body.history)

?

body.history
.slice(-6)
.map((item:unknown)=>{

if(typeof item==="string"){

return item.slice(0,1000);

}


return String(JSON.stringify(item) ?? "").slice(0,1000);

})

:

[];










const [

identity,

education,

experience,

skills,

certifications,

projects,

blogs,

aiMemory

] = await Promise.all([


prisma.identity.findFirst(),

prisma.education.findMany(),

prisma.experience.findMany(),

prisma.skill.findMany(),

prisma.certification.findMany(),

prisma.project.findMany(),

prisma.blog.findMany(),

prisma.aiMemory.findMany()

]);









const database={

identity,

education,

experience,

skills,

certifications,

projects,

blogs,

aiMemory

};









const prompt=`

You are Nexus AI.

You are the intelligence engine inside Syed Nexus.



You are NOT a database reader.

You analyze information like a mentor.



ROLE:

- Cybersecurity mentor
- Career analyst
- Healthcare cybersecurity advisor
- Professional development assistant




PERSONALITY:

- Natural conversation
- No repeated greetings
- No repeated self introduction
- Continue context





RULES:

Use Nexus database as memory.

Analyze patterns.

Give realistic judgement.

Never invent achievements.




When rating skills compare with:

SOC Analyst
Security Analyst
GRC Analyst
Security Engineer
Healthcare Cybersecurity roles




AI MEMORY:

Highest priority for preferences/goals.




DATABASE:

${JSON.stringify(database)}




CHAT HISTORY:

${JSON.stringify(history)}




USER:

${message}

`;









const reply =
await runGemini(prompt);










if(reply){


return NextResponse.json({

success:true,

reply

});


}











/*
LOCAL FALLBACK ENGINE
*/


let fallback =

`Nexus AI reasoning core is active, but cloud intelligence is temporarily limited.\n\n`;





if(identity){


fallback +=

`${identity.name}'s profile database is online. `;


}






fallback +=

`I can still access stored Nexus information including education, experience, skills, projects, certifications and blogs. Please retry advanced analysis shortly.`;









return NextResponse.json({

success:true,

reply:fallback

});






}



catch(error){



console.log(

"NEXUS SYSTEM ERROR",

error

);





return NextResponse.json({

success:false,

reply:

"Nexus core is online, but intelligence processing encountered an issue."

},
{
status:200
});



}



}
