"use client";


import { useEffect, useState } from "react";

import { profile } from "@/data/profile";





export type BlogPost={

title:string;

category:string;

content:string;

date:string;

};





type NexusData = Omit<typeof profile,"blogs"> & {

blogs:{

categories:string[];

posts:BlogPost[];

};

};







export function useNexusData(){



const [data,setData]=useState<NexusData>({


...(profile as any),


blogs:{

categories:profile.blogs.categories,

posts:[]

}


});








useEffect(()=>{






const identity={

...profile.identity,

...JSON.parse(

localStorage.getItem("nexus_identity") ||

"{}"

)

};









const education = JSON.parse(

localStorage.getItem("nexus_education") ||

JSON.stringify(profile.education)

)

.sort((a:any,b:any)=>{


const year=(x:string)=>{

const y=x.match(/\d{4}/g);

return y ? Number(y[y.length-1]) : 0;

};


return year(b.period)-year(a.period);


});









const experience = JSON.parse(

localStorage.getItem("nexus_experience") ||

JSON.stringify(profile.experience)

);








const skills = JSON.parse(

localStorage.getItem("nexus_skills") ||

JSON.stringify(profile.skills)

);








const certifications = JSON.parse(

localStorage.getItem("nexus_certifications") ||

JSON.stringify(profile.certifications)

);









const projects = JSON.parse(

localStorage.getItem("nexus_projects") ||

JSON.stringify(profile.projects)

);










const posts:BlogPost[] = JSON.parse(

localStorage.getItem("nexus_blogs") ||

"[]"

);










setData({


...(profile as any),


identity,


education,


experience,


skills,


certifications,


projects,


blogs:{


categories:profile.blogs.categories,


posts


}



});







},[]);






return data;



}