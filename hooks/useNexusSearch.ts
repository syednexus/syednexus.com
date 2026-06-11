"use client";


import { useState } from "react";
import { useNexusData } from "./useNexusData";




export type SearchResult = {

type:string;
title:string;
description:string;
icon:string;

};




type BlogPost = {

id:number;
title:string;
category:string;
content:string;
date:string | Date;

};








export function useNexusSearch(){



const profile = useNexusData();


const [query,setQuery] = useState("");





function search():SearchResult[]{



if(!query.trim()){

return [];

}



const keyword=query.toLowerCase();


const results:SearchResult[]=[];






// IDENTITY


const identityText = JSON.stringify(

profile.identity

).toLowerCase();



if(identityText.includes(keyword)){


results.push({

type:"Identity",

title:profile.identity.name,

description:profile.identity.headline,

icon:"👤"

});


}







// EDUCATION


profile.education.forEach(item=>{


if(JSON.stringify(item).toLowerCase().includes(keyword)){


results.push({

type:"Education",

title:item.degree,

description:item.institution,

icon:"🎓"

});


}


});








// EXPERIENCE


profile.experience.forEach(item=>{


if(JSON.stringify(item).toLowerCase().includes(keyword)){


results.push({

type:"Experience",

title:item.role,

description:item.company,

icon:"💼"

});


}


});








// SKILLS


Object.entries(profile.skills)

.forEach(([category,items])=>{


(items as string[]).forEach(skill=>{


if(skill.toLowerCase().includes(keyword)){


results.push({

type:category,

title:skill,

description:"Capability Matrix",

icon:"🧠"

});


}


});


});








// CERTIFICATIONS


profile.certifications.forEach(cert=>{


if(JSON.stringify(cert).toLowerCase().includes(keyword)){


results.push({

type:"Certification",

title:cert.name,

description:cert.issuer,

icon:"🛡"

});


}


});








// PROJECTS


profile.projects.forEach(project=>{


if(JSON.stringify(project).toLowerCase().includes(keyword)){


results.push({

type:"Project",

title:project.name,

description:project.description,

icon:"⚔"

});


}


});








// BLOGS


const blogs = (profile.blogs?.posts ?? []) as BlogPost[];




blogs.forEach(blog=>{


if(JSON.stringify(blog).toLowerCase().includes(keyword)){


results.push({

type:"Blog",

title:blog.title,

description:blog.category,

icon:"📝"

});


}


});








return results;


}






return {

query,

setQuery,

results:search()

};



}