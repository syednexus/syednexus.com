"use client";


import { useEffect,useState } from "react";

import { profile } from "@/data/profile";





export function useNexusData(){



const [data,setData]=useState(profile);






useEffect(()=>{

load();

},[]);








async function load(){



try{



const res =
await fetch("/api/nexus");



if(!res.ok){

throw new Error("Nexus API offline");

}



const json =
await res.json();









// IDENTITY 

const identity =
json.identity

?

{

...profile.identity,

...json.identity,


email:

json.identity.email

?

[json.identity.email]

:

profile.identity.email,


linkedin:

json.identity.linkedin || "",


github:

json.identity.github || "",


resume:

json.identity.resume || ""


}

:

profile.identity;





// EDUCATION FIX

const education =

(json.education || [])

.map((edu:any)=>({

...edu,


focus:

typeof edu.focus==="string"

?

edu.focus
.split(",")
.map((x:string)=>x.trim())

:

edu.focus


}));










// EXPERIENCE FIX

const experience =

(json.experience || [])

.map((job:any)=>({

...job,


details:

typeof job.details==="string"

?

job.details
.split(",")
.map((x:string)=>x.trim())

:

job.details


}));









// CERTIFICATION FIX

const certifications =

(json.certifications || [])

.map((cert:any)=>({

...cert,


skills:

typeof cert.skills==="string"

?

cert.skills
.split(",")
.map((x:string)=>x.trim())

:

cert.skills


}));









// PROJECT FIX

const projects =

(json.projects || [])

.map((project:any)=>({

...project,


technologies:

typeof project.technologies==="string"

?

project.technologies
.split(",")
.map((x:string)=>x.trim())

:

project.technologies


}));










// SKILLS DATABASE FIX 🔥

const skillGroups:Record<string,string[]>={

cybersecurity:[],

tools:[],

networking:[],

programming:[],

pharmacy:[]

};




if(Array.isArray(json.skills)){

json.skills

.forEach((skill:any)=>{


if(skillGroups[skill.category]){


skillGroups[skill.category].push(skill.name);


}


});

}

else if(json.skills && typeof json.skills==="object"){

Object.entries(json.skills)

.forEach(([category,skills])=>{


skillGroups[category]=

Array.isArray(skills)

?

skills.map(String)

:

[];


});

}










// BLOG DATABASE FIX 🔥

const blogs={

posts:

json.blogs || []

};










setData({


...profile,

...json,


identity,

education,

experience,

certifications,

projects,


skills:skillGroups,


blogs


});






}



catch(error){



console.error(

"Nexus database offline",

error

);



}



}








return data;



}
